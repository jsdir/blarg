package main

import (
	"errors"
	"fmt"
)

type RoomMessage struct {
	Type    string
	Payload interface{}
}

type Comment struct {
	Text     string
	SenderId string
}

type Room struct {
	title        string
	comments     []Comment
	totalViewers int64
	viewers      map[string]bool
	subscribers  []chan RoomMessage
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
	}
}

type State interface {
	// userId is "" if the user is unauthenticated
	Join(roomId string, userId string) *Room
	// userId is "" if the user is unauthenticated
	Leave(roomId string, userId string)
	AddComment(roomId string, comment Comment)
	ChangeRoomTitle(roomId string, title string)
	// Subscribe(roomId string) chan RoomMessage
}

type LocalState struct {
	rooms map[string]Room
}

func (s *LocalState) Join(roomId string, userId string) *Room {
	room := s.getRoom(roomId)
	if room == nil {
		room = &Room{
			title:   userId + "'s Room",
			viewers: make(map[string]bool),
		}
	}

	fmt.Printf("%#v", room)
	room.viewers[userId] = true
	// TODO: use unique ips for unauthenticated users.
	// use redis HyperLogLogs?
	room.totalViewers += 1

	s.broadcast(roomId, RoomMessage{
		Type:    JOIN,
		Payload: userId,
	})

	s.rooms[roomId] = *room

	return room
}

func (s *LocalState) Leave(roomId string, userId string) {
	room := s.getRoom(roomId)
	if room == nil {
		return
	}

	delete(room.viewers, userId)

	s.broadcast(roomId, RoomMessage{
		Type:    LEAVE,
		Payload: userId,
	})
}

func (s *LocalState) AddComment(roomId string, comment Comment) {
	room := s.getRoom(roomId)
	if room == nil {
		return
	}

	room.comments = append(room.comments, comment)

	s.broadcast(roomId, RoomMessage{
		Type: ADD_COMMENT,
		Payload: map[string]interface{}{
			"text":     comment.Text,
			"senderId": comment.SenderId,
		},
	})
}

func (s *LocalState) ChangeRoomTitle(roomId string, title string) {
	room := s.getRoom(roomId)
	if room == nil {
		return
	}

	room.title = title

	s.broadcast(roomId, RoomMessage{
		Type:    CHANGE_TITLE,
		Payload: title,
	})
}

func (s *LocalState) broadcast(roomId string, message RoomMessage) {
	room := s.getRoom(roomId)
	if room == nil {
		return
	}

	for _, subscriber := range room.subscribers {
		subscriber <- message
	}
}

func (s *LocalState) getRoom(roomId string) *Room {
	room := s.rooms[roomId]
	return &room
}
