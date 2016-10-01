/* global API_BASE_URL */

import React, { Component } from 'react'

export default
class Home extends Component {

  static propTypes = {

  }

  componentWillMount() {
    // TODO: if authenticated, redirect to the authenticated user's room.
  }

  render() {
    return (
      <div>
        <h1>Blarg.im</h1>
        <p>A humble clone of <a href="https://blab.im">Blab.im</a></p>
        <a href={`${API_BASE_URL}/authenticate`}>Login With Twitter</a>
      </div>
    )
  }
}
