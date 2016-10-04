/* global API_BASE_URL */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
// import { replace } from 'redux-router'

class Home extends Component {

  static propTypes = {
    authenticatedUser: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
    session: PropTypes.shape({
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
      }),
    }).isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  componentWillMount() {
    // If the user is authenticated, immediately redirect to their room.
    const { user } = this.props.session

    if (user) {
      this.context.router.replace(user.username)
    }
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

export default connect(
  ({ session }) => ({ session })
)(Home)
