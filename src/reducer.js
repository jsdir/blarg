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
} from 'constants'

const incr = v => v + 1
const decr = v => v - 1

const defaultRoom = {
  loading: true,
  error: null,
}

const roomReducer = handleActions({
  [JOIN]: () => defaultRoom,
  [LEAVE]: () => defaultRoom,
  [ADD_COMMENT]: (state, action) => update(state, {
    comments: { $push: [{
      senderId: state.userId,
      text: action.payload,
    }] },
  }),
  [COMMENT_ADDED]: (state, action) => update(state, {
    comments: { $push: [action.payload] },
  }),
  [ROOM_DATA]: (_, action) => action.payload,
  [USER_JOINED]: (state, action) => update(state, {
    totalViewers: { $apply: incr },
    activeViewers: { $apply: incr },
    ...(action.payload && {
      viewers: { $push: [action.payload] },
    }),
  }),
  [USER_LEFT]: (state, action) => update(state, {
    activeViewers: { $apply: decr },
    ...(action.payload && {
      viewers: { $apply: v => v.filter(vv => vv !== action.payload) },
    }),
  }),
  [CHANGE_TITLE]: (state, action) => update(state, {
    title: {
      $set: action.payload,
    },
  }),
}, defaultRoom)

const userReducer = (state = {
  id: window.BLARG_PAYLOAD.userId,
}) => state

export default combineReducers({
  room: roomReducer,
  user: userReducer,
})
