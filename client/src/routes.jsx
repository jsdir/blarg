import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from 'handlers/App'
import Home from 'handlers/Home'
import Room from 'handlers/Room'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/:username" component={Room} />
  </Route>
)
