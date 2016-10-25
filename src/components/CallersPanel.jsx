import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  hideCallers,
  acceptCaller,
} from 'actions'
import CloseButton from 'components/CloseButton'
import CallersPanelCaller from 'components/CallersPanelCaller'

class CallersPanel extends Component {

  static propTypes = {
    callers: PropTypes.arrayOf(
      PropTypes.string.isRequired,
    ).isRequired,
    hideCallers: PropTypes.func.isRequired,
    acceptCaller: PropTypes.func.isRequired,
  }

  renderCaller = (userId) => (
    <CallersPanelCaller
      key={userId}
      userId={userId}
      acceptCaller={this.props.acceptCaller}
    />
  )

  // TODO: overlay (click to close)
  render() {
    return (
      <div className="CallersPanel">
        <div className="CallersPanel__header">
          <span>
            {this.props.callers.length}
            {' '}
            {this.props.callers.length === 1 ? 'person' : 'people'}
            {' '}
            calling in
          </span>
          <CloseButton onClick={this.props.hideCallers} />
        </div>
        {this.props.callers.map(this.renderCaller)}
      </div>
    )
  }
}

export default connect(
  ({ room }) => ({ callers: room.callers }),
  {
    hideCallers,
    acceptCaller,
  },
)(CallersPanel)
