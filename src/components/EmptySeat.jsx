import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Button from 'components/Button'
import {
  showCallers,
  call,
  cancelCall,
} from 'actions'
import User from 'components/User'

const renderCaller = (userId) => (
  <User
    showUsername
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
    return isCalling ? (
      <div>
        <span>calling in ...</span>
        <Button onClick={this.cancelCall}>
          Cancel
        </Button>
      </div>
    ) : (
      <Button onClick={this.call}>
        Join
      </Button>
    )
  }

  renderCallers() {
    return (
      <div>
        {this.props.callers.map(renderCaller)}
        <Button onClick={this.props.showCallers}>
          Show Callers
        </Button>
      </div>
    )
  }

  render() {
    return (
      <div className="EmptySeat Seat">
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
