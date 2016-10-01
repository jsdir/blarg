import { combineReducers } from 'redux'
import { routerStateReducer } from 'redux-router'
import { handleActions } from 'redux-actions'

import {
  AUTH,
} from 'constants'

const userReducer = handleActions({
  [AUTH]: (state, action) => action.payload,
}, null)

// const roomsReducer = handleActions({
//   [HANDLE_ROOM_EVENT]: (state, action) => {
//     console.log(action.payload)
//     return state
//   },
// })

export default combineReducers({
  user: userReducer,
  // rooms: roomsReducer,
  router: routerStateReducer,
})
