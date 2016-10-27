import React, { PropTypes } from 'react'

import User from 'components/User'
import Username from 'components/Username'

const Comment = props => (
  <div className="Comment">
    <User username={props.comment.senderId} />
    <div className="Comment__content">
      <Username username={props.comment.senderId} />
      <span className="Comment__text">
        {props.comment.text}
      </span>
    </div>
  </div>
)

Comment.propTypes = {
  comment: React.PropTypes.shape({
    text: PropTypes.string.isRequired,
    senderId: PropTypes.string.isRequired,
  }).isRequired,
}

export default Comment
