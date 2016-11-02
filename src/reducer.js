/* eslint-env browser */

import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

import {
  ROOM_DATA,
  SHOW_CALLERS,
  HIDE_CALLERS,
  RESET_ROOM,

  JOIN_ACTION,
  JOIN,
  LEAVE_ACTION,
  LEAVE,
  ADD_COMMENT_ACTION,
  ADD_COMMENT,
  CHANGE_TITLE_ACTION,
  CHANGE_TITLE,
  ACCEPT_CALLER_ACTION,
  ACCEPT_CALLER,
  LEAVE_SEAT_ACTION,
  LEAVE_SEAT,
  CALL_ACTION,
  CALL,
  CANCEL_CALL_ACTION,
  CANCEL_CALL,
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

const acceptCaller = (state, action) => update(state, {
  callers: { $apply: removeFromArray(action.payload) },
  seats: { $push: [action.payload] },
  showCallers: { $set: false },
})

const call = (state, action) => update(state, {
  callers: { $push: [action.payload] },
})

const leaveSeat = (state, action) => update(state, {
  seats: { $apply: removeFromArray(action.payload) },
})

const cancelCall = (state, action) => update(state, {
  callers: { $apply: removeFromArray(action.payload) },
})

const roomReducer = handleActions({
  [ROOM_DATA]: (_, action) => action.payload,
  [SHOW_CALLERS]: (state) => update(state, {
    showCallers: { $set: true },
  }),
  [HIDE_CALLERS]: hideCallers,
  [RESET_ROOM]: (state) => update(state, {
    callers: { $set: [] },
    seats: { $set: [] },
  }),
  [JOIN_ACTION]: getDefaultRoom,
  [JOIN]: (state, action) => update(state, {
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
  [LEAVE_ACTION]: getDefaultRoom,
  [LEAVE]: (state, action) => update(state, {
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
  [ADD_COMMENT_ACTION]: addComment,
  [ADD_COMMENT]: addComment,
  [CHANGE_TITLE_ACTION]: changeTitle,
  [CHANGE_TITLE]: changeTitle,
  [ACCEPT_CALLER_ACTION]: acceptCaller,
  [ACCEPT_CALLER]: acceptCaller,
  [LEAVE_SEAT_ACTION]: leaveSeat,
  [LEAVE_SEAT]: leaveSeat,
  [CALL_ACTION]: call,
  [CALL]: call,
  [CANCEL_CALL_ACTION]: cancelCall,
  [CANCEL_CALL]: cancelCall,
}, defaultRoom)

const userReducer = (state = {
  id: window.BLARG_PAYLOAD.userId,
}) => state

export default combineReducers({
  room: roomReducer,
  user: userReducer,
})
