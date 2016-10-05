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

	// errch := make(chan error)
	stopch := make(chan bool)
	currentRoomId := ""

	// Receive messages
	for {
		var message RoomMessage
		if err := conn.ReadJSON(&message); err != nil {
			handleInternalServerError(err, w)
			return
		}

		switch message.Type {
		case JOIN:
			if currentRoomId != "" {
				stopch <- true
			}

			currentRoomId = message.Payload.(string)
			println("currentRoomId: ", currentRoomId)
			room := s.State.Join(currentRoomId, userId)

			// Send the initial payload on join.
			roomData := getMessage(ROOM_DATA, room.ToJSON())
			if err = conn.WriteJSON(roomData); err != nil {
				handleInternalServerError(err, w)
				return
			}

			// messages := c.State.Subscribe(currentRoomId)
			// go func() {
			// 	for {
			// 		select {
			// 		case message := <-messages:
			// 			err = conn.WriteJSON(message.Payload)
			// 			if err != nil {
			// 				// TODO: errch <- err
			// 				return
			// 			}
			// 		case <-stopch:
			// 			return
			// 		}
			// 	}
			// }()

		case LEAVE:
			if currentRoomId != "" {
				s.State.Leave(currentRoomId, userId)
				currentRoomId = ""
				stopch <- true
			}
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
