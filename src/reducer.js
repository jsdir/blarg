import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

import {
  AUTH,
  JOIN,
  LEAVE,
  ADD_COMMENT,
  ROOM_DATA,
  COMMENT_ADDED,
  USER_JOINED,
  USER_LEFT,
} from 'constants'

const incr = v => v + 1
const decr = v => v - 1

const roomsReducer = handleActions({
  [JOIN]: (state, action) => (
    // TODO: set a loading state here?
    Object.assign({}, state, { activeRoomId: action.payload })
  ),
  [LEAVE]: (state) => (
    Object.assign({}, state, { activeRoomId: null })
  ),
  [ADD_COMMENT]: (state, action) => update(state, {
    rooms: {
      [state.activeRoomId]: {
        comments: { $push: [{
          senderId: state.user.username,
          text: action.payload,
        }] },
      },
    },
  }),
  [COMMENT_ADDED]: (state, action) => {
    if (state.user && action.payload.senderId === state.user.username) {
      return state
    }

    return update(state, {
      rooms: {
        [state.activeRoomId]: {
          comments: { $push: [action.payload] },
        },
      },
    })
  },
  [ROOM_DATA]: (state, action) => update(state, {
    rooms: {
      $merge: {
        // send the `roomId` in the payload
        [state.activeRoomId]: action.payload,
      },
    },
  }),
  [AUTH]: (state, action) => update(state, { $merge: {
    user: action.payload,
    loading: false,
  } }),
  [USER_JOINED]: (state, action) => update(state, {
    rooms: {
      [state.activeRoomId]: {
        totalViewers: { $apply: incr },
        activeViewers: { $apply: incr },
        ...(action.payload && {
          viewers: { $push: [action.payload] },
        }),
      },
    },
  }),
  [USER_LEFT]: (state, action) => update(state, {
    rooms: {
      [state.activeRoomId]: {
        activeViewers: { $apply: decr },
        ...(action.payload && {
          viewers: { $apply: v => v.filter(vv => vv !== action.payload) },
        }),
      },
    },
  }),
}, {
  rooms: {},
  activeRoomId: null,
  user: null,
  loading: true,
})

export default combineReducers({
  rooms: roomsReducer,
})
