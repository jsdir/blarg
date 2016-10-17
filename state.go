package main

import "errors"

type RoomMessage struct {
	Type    string
	Payload interface{}
}

type Comment struct {
	Text     string `json:"text"`
	SenderId string `json:"senderId"`
}

type Room struct {
	title        string
	comments     []Comment
	totalViewers int64
	viewers      map[string]bool
	subscribers  map[chan RoomMessage]bool
}

var noRoomError = errors.New("room not found")

func (r *Room) ToJSON() map[string]interface{} {
	viewerIds := []string{}
	for viewerId := range r.viewers {
		viewerIds = append(viewerIds, viewerId)
	}

	return map[string]interface{}{
		"title":        r.title,
		"viewers":      viewerIds,
		"totalViewers": r.totalViewers,
		"comments":     r.comments,
	}
}

type State interface {
	// userId is "" if the user is unauthenticated
	Join(roomId string, userId string) *Room
	// userId is "" if the user is unauthenticated
	Leave(roomId string, userId string)
	AddComment(roomId string, comment Comment)
	ChangeRoomTitle(roomId string, title string)
	Subscribe(roomId string) (chan RoomMessage, chan bool)
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
			title:       userId + "'s Room",
			viewers:     make(map[string]bool),
			comments:    []Comment{},
			subscribers: map[chan RoomMessage]bool{},
		}
	}

	if userId != "" {
		room.viewers[userId] = true
	}

	// TODO: use unique ips for unauthenticated users.
	// use redis HyperLogLogs?
	room.totalViewers += 1

	s.broadcast(roomId, RoomMessage{
		Type:    USER_JOINED,
		Payload: userId,
	})

	s.rooms[roomId] = room

	return &room
}

func (s *LocalState) Leave(roomId string, userId string) {
	room, ok := s.rooms[roomId]
	if !ok {
		return
	}

	delete(room.viewers, userId)
	s.rooms[roomId] = room

	s.broadcast(roomId, RoomMessage{
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

	s.broadcast(roomId, RoomMessage{
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

	s.broadcast(roomId, RoomMessage{
		Type:    CHANGE_TITLE,
		Payload: title,
	})
}

func (s *LocalState) Subscribe(roomId string) (chan RoomMessage, chan bool) {
	room, ok := s.rooms[roomId]
	if !ok {
		return nil, nil
	}

	messages := make(chan RoomMessage)
	room.subscribers[messages] = true

	s.rooms[roomId] = room

	cancelChan := make(chan bool)

	go func() {
		<-cancelChan
		delete(room.subscribers, messages)
	}()

	return messages, cancelChan

}

func (s *LocalState) broadcast(roomId string, message RoomMessage) {
	room, ok := s.rooms[roomId]
	if !ok {
		return
	}

	for subscriber := range room.subscribers {
		subscriber <- message
	}
}
