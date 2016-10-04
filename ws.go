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

func makeMessage(
	messageType string, payload map[string]interface{},
) map[string]interface{} {
	return map[string]interface{}{
		"type":    messageType,
		"payload": payload,
	}
}

func (c *Context) HandleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer conn.Close()

	session, err := c.RediStore.Get(r, sessionPrefix)
	if err != nil {
		http.Error(w, "Error getting session, "+err.Error(), 500)
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
		http.Error(w, "Error sending AUTH, "+err.Error(), 500)
		return
	}

	// errch := make(chan error)
	stopch := make(chan bool)

	currentRoomId := ""

	// Receive messages
	for {
		var message RoomMessage
		if err := conn.ReadJSON(&message); err != nil {
			panic(err)
		}

		switch message.Type {
		case JOIN:
			if currentRoomId != "" {
				stopch <- true
			}

			currentRoomId = message.Payload.(string)
			print(currentRoomId)
			room := c.State.Join(currentRoomId, userId)

			// Send the initial payload on join.
			roomData := makeMessage(ROOM_DATA, room.ToJSON())
			if err = conn.WriteJSON(roomData); err != nil {
				log.Println(err.Error())
				// continue
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
				c.State.Leave(currentRoomId, userId)
				currentRoomId = ""
				stopch <- true
			}
		case ADD_COMMENT:
			// Checks that:
			// 1. A room is already loaded.
			// 2. The user is authenticated.
			if currentRoomId != "" && userId != "" {
				c.State.AddComment(currentRoomId, Comment{
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
				c.State.ChangeRoomTitle(currentRoomId, title)
			}
		}
	}

	// TODO: stopch <- true
	// TODO: handle errors (ignore)
	// TODO: if an EOF, manually call leave if userId and currentRoomId
}
