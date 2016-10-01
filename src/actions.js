import { createAction } from 'redux-actions'

import {
  CONNECT_FEED,
  DISCONNECT_FEED,
  JOIN,
  LEAVE,
} from 'constants'

export const connectFeed = createAction(CONNECT_FEED)
export const disconnectFeed = createAction(DISCONNECT_FEED)
export const join = createAction(JOIN)
export const leave = createAction(LEAVE)
