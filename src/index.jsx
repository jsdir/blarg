/* eslint-env browser */

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
// import createHistory from 'history/createBrowserHistory'
// import { Router } from 'react-router'

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
    // reduxReactRouter({ createHistory }),
    window.devToolsExtension
      ? window.devToolsExtension()
      : f => f,
  ),
)

window.store = store

render((
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>
), document.getElementById('root'))
