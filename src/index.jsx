/* eslint-env browser */

import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { Router, browserHistory as history } from 'react-router'

import reducer from './reducer'
import routes from './routes'

const store = createStore(reducer)

render((
  <Provider store={store}>
    <Router history={history}>{routes}</Router>
  </Provider>
), document.getElementById('root'))
