/* eslint-env browser */

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { ReduxRouter, reduxReactRouter } from 'redux-router'
import createHistory from 'history/lib/createBrowserHistory'

import reducer from './reducer'
import routes from './routes'
import connectionMiddleware from './middleware/connection'
import './style.scss'

const store = createStore(
  reducer,
  {},
  compose(
    applyMiddleware(
      connectionMiddleware,
    ),
    reduxReactRouter({ createHistory }),
    window.devToolsExtension
      ? window.devToolsExtension()
      : f => f,
  ),
)

window.store = store

render((
  <Provider store={store}>
    <ReduxRouter>{routes}</ReduxRouter>
  </Provider>
), document.getElementById('root'))
