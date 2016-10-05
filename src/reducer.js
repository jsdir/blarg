import { combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router'
import { handleActions } from 'redux-actions'
import update from 'react-addons-update'

import {
  AUTH,
  JOIN,
  LEAVE,
  ADD_COMMENT,
  ROOM_DATA,
} from 'constants'

const sessionReducer = handleActions({
  [AUTH]: (state, action) => ({
    user: action.payload,
    loading: false,
  }),
}, {
  user: null,
  loading: true,
})

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
          text: action.payload,
        }] },
      },
    },
  }),
  [ROOM_DATA]: (state, action) => update(state, {
    rooms: {
      $merge: {
        // send the `roomId` in the payload
        [state.activeRoomId]: action.payload,
      },
    },
  }),
}, {
  rooms: {},
  activeRoomId: null,
})

export default combineReducers({
  session: sessionReducer,
  rooms: roomsReducer,
  router: routerStateReducer,
})
