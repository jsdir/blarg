package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

const (
	AUTH         = "AUTH"
	JOIN         = "JOIN"
	LEAVE        = "LEAVE"
	ADD_COMMENT  = "ADD_COMMENT"
	CHANGE_TITLE = "CHANGE_TITLE"
	ROOM_DATA    = "ROOM_DATA"

	// events
	COMMENT_ADDED = "COMMENT_ADDED"
	USER_JOINED   = "USER_JOINED"
	USER_LEFT     = "USER_LEFT"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func getMessage(
	messageType string, payload map[string]interface{},
) map[string]interface{} {
	return map[string]interface{}{
		"type":    messageType,
		"payload": payload,
	}
}

func (s *Server) HandleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade:", err)
		return
	}
	defer conn.Close()

	session, err := s.RediStore.Get(r, sessionPrefix)
	if err != nil {
		handleInternalServerError(err, w)
		return
	}

	// Send an initial payload message.
	message := map[string]interface{}{
		"type":    AUTH,
		"payload": nil,
	}

	userId := ""
	if session.Values[tokenCredKey] != nil {
		userId = session.Values[usernameKey].(string)
		message["payload"] = map[string]interface{}{
			"username": userId,
		}
	}

	err = conn.WriteJSON(message)
	if err != nil {
		handleInternalServerError(err, w)
		return
	}

	// Only one room available per connection.
	currentRoomId := ""

	leaveChan := make(chan bool)
	leave := func() {
		if currentRoomId != "" {
			leaveChan <- true
			s.State.Leave(currentRoomId, userId)
		}
	}
	defer leave()

	// Receive messages
	for {
		var message RoomMessage
		if err := conn.ReadJSON(&message); err != nil {
			// leaveChan <- true
			log.Println(err)
			// TODO: ignore close errors
			// Leave all the current channel if the connection is closed.
			// if websocket. .IsCloseError(err) {
			// 	log.Println(err)
			// 	// handleInternalServerError(err, w)
			// }
			// leave <- true
			return
		}

		switch message.Type {
		case JOIN:
			leave()
			currentRoomId = message.Payload.(string)
			room := s.State.Join(currentRoomId, userId)

			// Send the initial payload on join.
			roomData := getMessage(ROOM_DATA, room.ToJSON())
			if err = conn.WriteJSON(roomData); err != nil {
				// TODO: leave <- true
				// handleInternalServerError(err, w)
				return
			}

			// Subscribe to any changes in the room.
			messages, cancelChan := s.State.Subscribe(currentRoomId)
			go func() {
				for {
					select {
					case message := <-messages:
						err = conn.WriteJSON(map[string]interface{}{
							"payload": message.Payload,
							"type":    message.Type,
						})
						if err != nil {
							// TODO: errch <- err
							return
						}
					case <-leaveChan:
						cancelChan <- true
						return
					}
				}
			}()

		case ADD_COMMENT:
			// Checks that:
			// 1. A room is already loaded.
			// 2. The user is authenticated.
			if currentRoomId != "" && userId != "" {
				s.State.AddComment(currentRoomId, Comment{
					SenderId: userId,
					Text:     message.Payload.(string),
				})
			}

		case CHANGE_TITLE:
			// Checks that:
			// 1. A room is already loaded.
			// 2. The user is authenticated.
			// 3. The user is the host.
			if currentRoomId != "" && userId != "" && currentRoomId == userId {
				title := message.Payload.(string)
				s.State.ChangeRoomTitle(currentRoomId, title)
			}
		}
	}

	// TODO: stopch <- true
	// TODO: handle errors (ignore)
	// TODO: if an EOF, manually call leave if userId and currentRoomId
}
