/* eslint-env browser */
/* global WS_URL */

import { handleError } from 'actions'
import {
  CONNECT_FEED,
  JOIN,
  LEAVE,
  ADD_COMMENT,
  CHANGE_TITLE,
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
    case ADD_COMMENT:
      send(
        JSON.stringify({
          type: action.type,
          payload: action.payload.text,
        })
      )
      break
    case JOIN:
    case LEAVE:
    case CHANGE_TITLE:
      send(JSON.stringify(action))
      break
    default:
      break
  }

  return next(action)
}

export default connectionMiddleware
