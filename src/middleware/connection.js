/* eslint-env browser */
/* global API_BASE_URL */

import { handleError } from 'actions'
import {
  CONNECT_FEED,
  DISCONNECT_FEED,
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
      // TODO: ${API_BASE_URL}
      connection = new WebSocket('ws://localhost:8000/v1/ws')
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
    case DISCONNECT_FEED:
      connection.close()
      connection = null
      break
    case ADD_COMMENT:
    case JOIN:
    case LEAVE:
      connection.send(JSON.stringify(action))
      break
    default:
      break
  }

  return next(action)
}

export default connectionMiddleware
