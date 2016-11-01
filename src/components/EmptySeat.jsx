/* global BASE_URL */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Button from 'components/Button'
import {
  showCallers,
  call,
  cancelCall,
} from 'actions'
import User from 'components/User'

const CALLER_PREVIEW_LIMIT = 5

const renderCaller = (userId) => (
  <User
    username={userId}
    key={userId}
  />
)

class EmptySeat extends Component {

  static propTypes = {
    userId: PropTypes.string.isRequired,
    callers: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired,
    isHost: PropTypes.bool.isRequired,
    showCallers: PropTypes.func.isRequired,
    call: PropTypes.func.isRequired,
    cancelCall: PropTypes.func.isRequired,
    size: PropTypes.number.isRequired,
    seatCount: PropTypes.number.isRequired,
  }

  call = () => {
    this.props.call(this.props.userId)
  }

  cancelCall = () => {
    this.props.cancelCall(this.props.userId)
  }

  renderJoin() {
    const { callers, userId } = this.props
    const isCalling = callers.indexOf(userId) > -1
    return isCalling ? [
      <div key="1" className="EmptySeat__waiting">
        <i className="fa fa-circle-o-notch fa-spin" />
        <span>Calling in...</span>
      </div>,
      <Button key="2" onClick={this.cancelCall}>
        Cancel
      </Button>,
    ] : (
      <Button primary onClick={this.call}>
        Join
      </Button>
    )
  }

  renderCallers() {
    return this.props.callers.length ? [
      <div key="1" className="EmptySeat__callers">
        {this.props.callers.slice(0, CALLER_PREVIEW_LIMIT).map(renderCaller)}
      </div>,
      <Button key="2" primary onClick={this.props.showCallers}>
        Show
        {' '}
        {this.props.callers.length}
        {' '}
        {this.props.callers.length === 1 ? 'Caller' : 'Callers'}
      </Button>,
    ] : [
      <div key="1" className="EmptySeat__waiting">
        <span>Waiting for callers...</span>
      </div>,
      this.props.seatCount === 0 ? (
        <div key="2">
          Share:
          {' '}
          <span className="EmptySeat__link">
            {BASE_URL}/{this.props.userId}
          </span>
        </div>
      ) : null,
    ]
  }

  render() {
    const { size } = this.props
    return (
      <div className="EmptySeat Seat" style={{ height: size, width: size }}>
        {this.props.isHost ? this.renderCallers() : this.renderJoin()}
      </div>
    )
  }
}

export default connect(({ user }) => ({ userId: user.id }), {
  showCallers,
  call,
  cancelCall,
})(EmptySeat)
