import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import User from 'components/User'
import Button from 'components/Button'
import { acceptCaller } from 'actions'

class CallersPanelCaller extends Component {

  static propTypes = {
    acceptCaller: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  }

  acceptCaller = () => {
    this.props.acceptCaller(this.props.userId)
  }

  render() {
    return (
      <div
        key={this.props.userId}
        className="CallersPanel__caller"
      >
        <User
          showUsername
          username={this.props.userId}
        />
        <Button onClick={this.acceptCaller}>
          Accept
        </Button>
      </div>
    )
  }
}

export default connect(null, {
  acceptCaller,
})(CallersPanelCaller)
