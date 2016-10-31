import { createAction } from 'redux-actions'

import {
  CONNECT_FEED,
  JOIN,
  LEAVE,
  ADD_COMMENT,
  HANDLE_ERROR,
  CHANGE_TITLE,
  SHOW_CALLERS,
  HIDE_CALLERS,
  ACCEPT_CALLER,
  CALL,
  CANCEL_CALL,
  USER_LEFT_SEAT,
} from 'constants'

// connectFeed()
export const connectFeed = createAction(CONNECT_FEED)
// join(roomId)
export const join = createAction(JOIN)
// leave()
export const leave = createAction(LEAVE)
// addComment({ text, senderId })
export const addComment = createAction(ADD_COMMENT)
// handleError(error)
export const handleError = createAction(HANDLE_ERROR)
// changeTitle(title)
export const changeTitle = createAction(CHANGE_TITLE)
// showCallers()
export const showCallers = createAction(SHOW_CALLERS)
// hideCallers()
export const hideCallers = createAction(HIDE_CALLERS)
// acceptCaller(userId)
export const acceptCaller = createAction(ACCEPT_CALLER)
// call(userId)
export const call = createAction(CALL)
// cancelCall(userId)
export const cancelCall = createAction(CANCEL_CALL)
// leaveSeat(userId)
export const leaveSeat = createAction(USER_LEFT_SEAT)
