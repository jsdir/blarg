package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

const (
	AUTH        = "AUTH"
	USER_JOINED = "USER_JOINED"
	USER_LEFT   = "USER_LEFT"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
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
		"payload": false,
	}

	if session.Values[tokenCredKey] != nil {
		message["payload"] = map[string]interface{}{
			"username": session.Values[usernameKey],
		}
	}

	err = conn.WriteJSON(message)

	if err != nil {
		log.Println("write:", err)
		//break
	}
}
