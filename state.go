package main

import "errors"

type StateMessage struct {
	Type     string
	Payload  interface{}
	SenderId string
	End      bool
}

type Comment struct {
	Text     string `json:"text"`
	SenderId string `json:"senderId"`
}

type Room struct {
	title        string
	comments     []Comment
	subscribers  map[chan StateMessage]string
	totalAnons   map[string]bool
	totalMembers map[string]bool
}

var noRoomError = errors.New("room not found")

func (r *Room) ToJSON() map[string]interface{} {
	totalViewers, activeViewers := r.getViewerCounts()

	viewerMap := map[string]bool{}
	for _, userId := range r.subscribers {
		if userId != "" {
			viewerMap[userId] = true
		}
	}

	viewers := []string{}
	for userId, _ := range viewerMap {
		viewers = append(viewers, userId)
	}

	return map[string]interface{}{
		"title":         r.title,
		"viewers":       viewers,
		"totalViewers":  totalViewers,
		"activeViewers": activeViewers,
		"comments":      r.comments,
		"seats":         []string{},
	}
}

func (r *Room) getViewerCounts() (int, int) {
	totalViewers := len(r.totalMembers) + len(r.totalAnons)
	activeViewers := len(r.subscribers)
	return totalViewers, activeViewers
}

func (r *Room) getViewerPayload(userId string) map[string]interface{} {
	totalViewers, activeViewers := r.getViewerCounts()
	return map[string]interface{}{
		"userId":        userId,
		"totalViewers":  totalViewers,
		"activeViewers": activeViewers,
	}
}

type State interface {
	// userId is "" if the user is unauthenticated
	Join(roomId string, userId string, address string) (*Room, chan StateMessage)
	// userId is "" if the user is unauthenticated
	Leave(roomId string, skip chan StateMessage, userId string)
	AddComment(roomId string, skip chan StateMessage, comment Comment)
	ChangeRoomTitle(roomId string, messages chan StateMessage, title string)
}

type LocalState struct {
	rooms map[string]Room
}

func NewLocalState() LocalState {
	return LocalState{
		rooms: map[string]Room{},
	}
}

func (s *LocalState) Join(roomId string, userId string, address string) (*Room, chan StateMessage) {
	room, ok := s.rooms[roomId]
	if !ok {
		room = Room{
			title:        roomId + "'s Room",
			comments:     []Comment{},
			subscribers:  map[chan StateMessage]string{},
			totalAnons:   map[string]bool{},
			totalMembers: map[string]bool{},
		}
	}

	// Only send the leave event for the member if there are no more
	// subscribers left.
	alreadyJoined := false
	for _, id := range room.subscribers {
		if id == userId {
			alreadyJoined = true
			break
		}
	}

	messages := make(chan StateMessage)
	room.subscribers[messages] = userId
	if userId == "" {
		room.totalAnons[address] = true
	} else {
		room.totalMembers[userId] = true
	}

	s.rooms[roomId] = room

	if alreadyJoined {
		userId = ""
	}

	s.broadcast(roomId, messages, StateMessage{
		Type:    USER_JOINED,
		Payload: room.getViewerPayload(userId),
	})

	return &room, messages
}

func (s *LocalState) Leave(roomId string, messages chan StateMessage, userId string) {
	room, ok := s.rooms[roomId]
	if !ok {
		return
	}

	messages <- StateMessage{End: true}
	delete(room.subscribers, messages)
	s.rooms[roomId] = room

	// Only send the leave event for the member if there are no more
	// subscribers left.
	for _, id := range room.subscribers {
		if id == userId {
			userId = ""
			break
		}
	}

	s.broadcast(roomId, messages, StateMessage{
		Type:    USER_LEFT,
		Payload: room.getViewerPayload(userId),
	})
}

func (s *LocalState) AddComment(roomId string, skip chan StateMessage, comment Comment) {
	room, ok := s.rooms[roomId]
	if !ok {
		return
	}

	room.comments = append(room.comments, comment)
	s.rooms[roomId] = room

	s.broadcast(roomId, skip, StateMessage{
		Type: COMMENT_ADDED,
		Payload: map[string]interface{}{
			"text":     comment.Text,
			"senderId": comment.SenderId,
		},
	})
}

func (s *LocalState) ChangeRoomTitle(roomId string, messages chan StateMessage, title string) {
	room, ok := s.rooms[roomId]
	if !ok {
		return
	}

	room.title = title
	s.rooms[roomId] = room

	s.broadcast(roomId, messages, StateMessage{
		Type:    TITLE_CHANGED,
		Payload: title,
	})
}

func (s *LocalState) broadcast(roomId string, skip chan StateMessage, message StateMessage) {
	room, ok := s.rooms[roomId]
	if !ok {
		return
	}

	for subscriber := range room.subscribers {
		if subscriber == skip {
			continue
		}

		subscriber <- message
	}
}
