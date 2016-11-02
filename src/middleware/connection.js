/* eslint-env browser */
/* global WS_URL */

import { handleError } from 'actions'
import {
  CONNECT_FEED,
  JOIN_ACTION,
  LEAVE_ACTION,
  ADD_COMMENT_ACTION,
  CHANGE_TITLE_ACTION,
  CALL_ACTION,
  CANCEL_CALL_ACTION,
  ACCEPT_CALLER_ACTION,
  LEAVE_SEAT_ACTION,
} from 'constants'

let connection
const messages = []

const send = data => {
  if (connection.readyState === 1) {
    connection.send(data)
  } else {
    messages.push(data)
  }
}

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
      connection.onopen = () => {
        messages.forEach(message => connection.send(message))
      }
      break
    case ADD_COMMENT_ACTION:
      send(
        JSON.stringify({
          type: action.type,
          payload: action.payload.text,
        })
      )
      break
    case JOIN_ACTION:
    case LEAVE_ACTION:
    case CHANGE_TITLE_ACTION:
    case CALL_ACTION:
    case CANCEL_CALL_ACTION:
    case ACCEPT_CALLER_ACTION:
    case LEAVE_SEAT_ACTION:
      send(JSON.stringify(action))
      break
    default:
      break
  }

  return next(action)
}

export default connectionMiddleware
