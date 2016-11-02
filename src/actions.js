import { createAction } from 'redux-actions'

import {
  CONNECT_FEED,
  SHOW_CALLERS,
  HIDE_CALLERS,
  HANDLE_ERROR,

  JOIN_ACTION,
  LEAVE_ACTION,
  ADD_COMMENT_ACTION,
  CHANGE_TITLE_ACTION,
  CALL_ACTION,
  CANCEL_CALL_ACTION,
  ACCEPT_CALLER_ACTION,
  LEAVE_SEAT_ACTION,
} from 'constants'

// connectFeed()
export const connectFeed = createAction(CONNECT_FEED)
// handleError(error)
export const handleError = createAction(HANDLE_ERROR)
// showCallers()
export const showCallers = createAction(SHOW_CALLERS)
// hideCallers()
export const hideCallers = createAction(HIDE_CALLERS)
// changeTitle(title)
export const changeTitle = createAction(CHANGE_TITLE_ACTION)
// join(roomId)
export const join = createAction(JOIN_ACTION)
// leave()
export const leave = createAction(LEAVE_ACTION)
// addComment({ text, senderId })
export const addComment = createAction(ADD_COMMENT_ACTION)
// acceptCaller(userId)
export const acceptCaller = createAction(ACCEPT_CALLER_ACTION)
// call(userId)
export const call = createAction(CALL_ACTION)
// cancelCall(userId)
export const cancelCall = createAction(CANCEL_CALL_ACTION)
// leaveSeat(userId)
export const leaveSeat = createAction(LEAVE_SEAT_ACTION)
