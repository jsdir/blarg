/* global API_BASE_URL */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { replace } from 'redux-router'

class Home extends Component {

  static propTypes = {
    user: PropTypes.shape({
      identity: PropTypes.string.isRequired,
    }),
    replace: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.loadProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.loadProps(nextProps)
  }

  loadProps(props) {
    if (props.user) {
      this.props.replace(props.user.identity)
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
  ({ user }) => ({ user }), { replace }
)(Home)
