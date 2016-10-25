/* eslint-env browser */

import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

import {
  JOIN,
  LEAVE,
  ADD_COMMENT,
  ROOM_DATA,
  COMMENT_ADDED,
  USER_JOINED,
  USER_LEFT,
  CHANGE_TITLE,
  TITLE_CHANGED,
  SHOW_CALLERS,
  HIDE_CALLERS,
  CALL,
  CANCEL_CALL,
  ACCEPT_CALLER,
  USER_LEFT_SEAT,
} from 'constants'

const addComment = (state, action) => update(state, {
  comments: { $push: [action.payload] },
})

const changeTitle = (state, action) => update(state, {
  title: { $set: action.payload },
})

const defaultRoom = {
  loading: true,
  error: null,
  showCallers: false,
}

const getDefaultRoom = () => defaultRoom

const hideCallers = (state) => update(state, {
  showCallers: { $set: false },
})

const removeFromArray = value => values => (
  values.filter(v => v !== value)
)

const roomReducer = handleActions({
  [JOIN]: getDefaultRoom,
  [LEAVE]: getDefaultRoom,
  [ADD_COMMENT]: addComment,
  [COMMENT_ADDED]: addComment,
  [ROOM_DATA]: (_, action) => action.payload,
  [USER_JOINED]: (state, action) => update(state, {
    totalViewers: { $set: action.payload.totalViewers },
    activeViewers: { $set: action.payload.activeViewers },
    ...(action.payload.userId && {
      viewers: { $push: [action.payload.userId] },
      comments: { $push: [{
        senderId: action.payload.userId,
        event: true,
        joined: true,
      }] },
    }),
  }),
  [USER_LEFT]: (state, action) => update(state, {
    totalViewers: { $set: action.payload.totalViewers },
    activeViewers: { $set: action.payload.activeViewers },
    ...(action.payload.userId && {
      viewers: { $apply: removeFromArray(action.payload.userId) },
      comments: { $push: [{
        senderId: action.payload.userId,
        event: true,
        joined: false,
      }] },
    }),
  }),
  [CHANGE_TITLE]: changeTitle,
  [TITLE_CHANGED]: changeTitle,
  [SHOW_CALLERS]: (state) => update(state, {
    showCallers: { $set: true },
  }),
  [HIDE_CALLERS]: hideCallers,
  [CALL]: (state, action) => update(state, {
    callers: { $push: [action.payload] },
  }),
  [CANCEL_CALL]: (state, action) => update(state, {
    callers: { $apply: removeFromArray(action.payload) },
  }),
  [ACCEPT_CALLER]: (state, action) => update(state, {
    callers: { $apply: removeFromArray(action.payload) },
    seats: { $push: [action.payload] },
  }),
  [USER_LEFT_SEAT]: (state, action) => update(state, {
    seats: { $apply: removeFromArray(action.payload) },
  }),
}, defaultRoom)

const userReducer = (state = {
  id: window.BLARG_PAYLOAD.userId,
}) => state

export default combineReducers({
  room: roomReducer,
  user: userReducer,
})
