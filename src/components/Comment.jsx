import React, { Component, PropTypes } from 'react'

import User from 'components/User'
import Username from 'components/Username'

class Comment extends Component {

  static propTypes = {
    comment: PropTypes.shape({
      text: PropTypes.string.isRequired,
      senderId: PropTypes.string.isRequired,
    }).isRequired,
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div className="Comment">
        <User username={this.props.comment.senderId} />
        <div className="Comment__content">
          <Username username={this.props.comment.senderId} />
          <span className="Comment__text">
            {this.props.comment.text}
          </span>
        </div>
      </div>
    )
  }
}

export default Comment
