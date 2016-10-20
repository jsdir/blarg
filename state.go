package main

import "errors"

type StateMessage struct {
	Type    string
	Payload interface{}
	End     bool
}

type Comment struct {
	Text     string `json:"text"`
	SenderId string `json:"senderId"`
}

type Room struct {
	title         string
	comments      []Comment
	totalViewers  int64
	activeViewers int64
	viewers       map[string]bool
	subscribers   map[chan StateMessage]bool
}

var noRoomError = errors.New("room not found")

func (r *Room) ToJSON() map[string]interface{} {
	viewerIds := []string{}
	for viewerId := range r.viewers {
		viewerIds = append(viewerIds, viewerId)
	}

	return map[string]interface{}{
		"title":         r.title,
		"viewers":       viewerIds,
		"totalViewers":  r.totalViewers,
		"activeViewers": r.activeViewers,
		"comments":      r.comments,
	}
}

type State interface {
	// userId is "" if the user is unauthenticated
	Join(roomId string, userId string) *Room
	SubscribeRoom(roomId string) chan StateMessage
	// userId is "" if the user is unauthenticated
	Leave(roomId string, userId string, messages chan StateMessage)
	AddComment(roomId string, comment Comment)
	ChangeRoomTitle(roomId string, title string)
}

type LocalState struct {
	rooms map[string]Room
}

func NewLocalState() LocalState {
	return LocalState{
		rooms: map[string]Room{},
	}
}

func (s *LocalState) Join(roomId string, userId string) *Room {
	room, ok := s.rooms[roomId]
	if !ok {
		room = Room{
			title:       roomId + "'s Room",
			viewers:     make(map[string]bool),
			comments:    []Comment{},
			subscribers: map[chan StateMessage]bool{},
		}
	}

	if userId != "" {
		room.viewers[userId] = true
	}

	// TODO: use unique ips for unauthenticated users.
	// use redis HyperLogLogs?
	room.totalViewers += 1
	room.activeViewers += 1

	s.broadcast(roomId, StateMessage{
		Type:    USER_JOINED,
		Payload: userId,
	})

	s.rooms[roomId] = room

	return &room
}

func (s *LocalState) SubscribeRoom(roomId string) chan StateMessage {
	room, ok := s.rooms[roomId]
	if !ok {
		return nil
	}

	messages := make(chan StateMessage)
	room.subscribers[messages] = true

	return messages
}

func (s *LocalState) Leave(roomId string, userId string, messages chan StateMessage) {
	room, ok := s.rooms[roomId]
	if !ok {
		return
	}

	messages <- StateMessage{End: true}
	delete(room.viewers, userId)
	delete(room.subscribers, messages)
	room.activeViewers -= 1
	s.rooms[roomId] = room

	s.broadcast(roomId, StateMessage{
		Type:    USER_LEFT,
		Payload: userId,
	})
}

func (s *LocalState) AddComment(roomId string, comment Comment) {
	room, ok := s.rooms[roomId]
	if !ok {
		return
	}

	room.comments = append(room.comments, comment)
	s.rooms[roomId] = room

	s.broadcast(roomId, StateMessage{
		Type: COMMENT_ADDED,
		Payload: map[string]interface{}{
			"text":     comment.Text,
			"senderId": comment.SenderId,
		},
	})
}

func (s *LocalState) ChangeRoomTitle(roomId string, title string) {
	room, ok := s.rooms[roomId]
	if !ok {
		return
	}

	room.title = title
	s.rooms[roomId] = room

	s.broadcast(roomId, StateMessage{
		Type:    CHANGE_TITLE,
		Payload: title,
	})
}

func (s *LocalState) broadcast(roomId string, message StateMessage) {
	room, ok := s.rooms[roomId]
	if !ok {
		return
	}

	for subscriber := range room.subscribers {
		subscriber <- message
	}
}
