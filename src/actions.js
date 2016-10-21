import { createAction } from 'redux-actions'

import {
  CONNECT_FEED,
  JOIN,
  LEAVE,
  ADD_COMMENT,
  HANDLE_ERROR,
  CHANGE_TITLE,
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
