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
} from 'constants'

const defaultRoom = {
  loading: true,
  error: null,
}

const addComment = (state, action) => update(state, {
  comments: { $push: [action.payload] },
})

const changeTitle = (state, action) => update(state, {
  title: { $set: action.payload },
})

const roomReducer = handleActions({
  [JOIN]: () => defaultRoom,
  [LEAVE]: () => defaultRoom,
  [ADD_COMMENT]: addComment,
  [COMMENT_ADDED]: addComment,
  [ROOM_DATA]: (_, action) => action.payload,
  [USER_JOINED]: (state, action) => update(state, {
    totalViewers: { $set: action.payload.totalViewers },
    activeViewers: { $set: action.payload.activeViewers },
    ...(action.payload.userId && {
      viewers: { $push: [action.payload.userId] },
    }),
  }),
  [USER_LEFT]: (state, action) => update(state, {
    totalViewers: { $set: action.payload.totalViewers },
    activeViewers: { $set: action.payload.activeViewers },
    ...(action.payload.userId && {
      viewers: { $apply: v => v.filter(vv => vv !== action.payload.userId) },
    }),
  }),
  [CHANGE_TITLE]: changeTitle,
  [TITLE_CHANGED]: changeTitle,
}, defaultRoom)

const userReducer = (state = {
  id: window.BLARG_PAYLOAD.userId,
}) => state

export default combineReducers({
  room: roomReducer,
  user: userReducer,
})
