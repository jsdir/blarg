package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	JOIN          = "JOIN"
	LEAVE         = "LEAVE"
	ADD_COMMENT   = "ADD_COMMENT"
	CHANGE_TITLE  = "CHANGE_TITLE"
	ROOM_DATA     = "ROOM_DATA"
	CALL          = "CALL"
	CANCEL_CALL   = "CANCEL_CALL"
	ACCEPT_CALLER = "ACCEPT_CALLER"
	SEAT_JOINED   = "SEAT_JOINED"

	// events
	USER_JOINED    = "USER_JOINED"
	USER_LEFT      = "USER_LEFT"
	COMMENT_ADDED  = "COMMENT_ADDED"
	TITLE_CHANGED  = "TITLE_CHANGED"
	USER_LEFT_SEAT = "USER_LEFT_SEAT"
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

	userId := ""
	if session.Values[tokenCredKey] != nil {
		userId = session.Values[usernameKey].(string)
	}

	// Tick
	timeout := time.Duration(60) * time.Second
	tickDuration := timeout / 2
	tick := time.Tick(tickDuration)
	tickCloseCh := make(chan bool)
	go func() {
		for {
			select {
			case <-tick:
				deadline := time.Now().Add(tickDuration)
				err := conn.WriteControl(
					websocket.PingMessage, nil, deadline,
				)
				if err != nil {
					// handleInternalServerError(err, w)
					return
				}
			case <-tickCloseCh:
				return
			}
		}
	}()

	defer func() {
		tickCloseCh <- true
	}()

	// Only one room available per connection.
	currentRoomId := ""
	isHost := false
	var roomMessages chan StateMessage

	leave := func() {
		if currentRoomId != "" {
			s.State.CancelCall(currentRoomId, roomMessages, userId)
			s.State.LeaveSeat(currentRoomId, roomMessages, userId)
			s.State.Leave(currentRoomId, roomMessages, userId)
			if isHost {
				// TODO: kick everyone
			}
		}
	}
	defer leave()

	// Receive messages
	for {
		var message StateMessage
		if err := conn.ReadJSON(&message); err != nil {
			if !websocket.IsCloseError(err, websocket.CloseGoingAway) {
				log.Println("read error:", err)
			}
			return
		}

		switch message.Type {
		case JOIN:
			leave()
			currentRoomId = message.Payload.(string)
			isHost = userId != "" && userId == currentRoomId
			room, messages := s.State.Join(currentRoomId, userId, r.RemoteAddr)
			roomMessages = messages

			// Send the initial payload on join.
			roomData := getMessage(ROOM_DATA, room.ToJSON())
			if err = conn.WriteJSON(roomData); err != nil {
				log.Println("join error:", err)
				return
			}

			go func() {
				for {
					message := <-roomMessages
					if message.End {
						return
					}

					err = conn.WriteJSON(map[string]interface{}{
						"payload": message.Payload,
						"type":    message.Type,
					})
					if err != nil {
						log.Println("send error:", err)
					}
				}
			}()

		case LEAVE:
			leave()

		case ADD_COMMENT:
			// Checks that:
			// 1. A room is already loaded.
			// 2. The user is authenticated.
			if currentRoomId != "" && userId != "" {
				s.State.AddComment(currentRoomId, roomMessages, Comment{
					SenderId: userId,
					Text:     message.Payload.(string),
				})
			}

		case CHANGE_TITLE:
			// Checks that:
			// 1. A room is already loaded.
			// 2. The user is authenticated.
			// 3. The user is the host.
			if isHost {
				title := message.Payload.(string)
				s.State.ChangeRoomTitle(currentRoomId, roomMessages, title)
			}

		case CALL:
			if currentRoomId != "" && userId != "" && currentRoomId != userId {
				s.State.Call(currentRoomId, roomMessages, userId)
			}

		case CANCEL_CALL:
			if currentRoomId != "" && userId != "" && currentRoomId != userId {
				s.State.CancelCall(currentRoomId, roomMessages, userId)
			}

		case ACCEPT_CALLER:
			if isHost {
				userId := message.Payload.(string)
				s.State.AcceptCaller(currentRoomId, roomMessages, userId)
			}

		}
	}
}
