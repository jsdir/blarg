/* eslint-env browser */
/* global WS_URL */

import { handleError } from 'actions'
import {
  CONNECT_FEED,
  JOIN,
  LEAVE,
  ADD_COMMENT,
} from 'constants'

let connection

const handleConnectionEvent = (event, data, dispatch) => dispatch({
  type: event,
  payload: data,
})

const connectionMiddleware = ({
  dispatch,
}) => (next) => (action) => {
  switch (action.type) {
    case CONNECT_FEED:
      connection = new WebSocket(WS_URL)
      connection.onerror = (error) => {
        dispatch(handleError(error))
      }
      connection.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleConnectionEvent(
          data.type, data.payload, dispatch
        )
      }
      break
    case ADD_COMMENT:
    case JOIN:
    case LEAVE:
      // connection.send(JSON.stringify(action))
      break
    default:
      break
  }

  return next(action)
}

export default connectionMiddleware
