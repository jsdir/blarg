import React, { PropTypes } from 'react'

import Username from 'components/Username'

const EventNotice = props => (
  <div className="EventNotice">
    <Username username={props.comment.senderId} />
    {' '}
    {props.comment.joined ? 'joined' : 'left'}
  </div>
)

EventNotice.propTypes = {
  comment: PropTypes.shape({
    senderId: PropTypes.string.isRequired,
    joined: PropTypes.bool.isRequired,
  }).isRequired,
}

export default EventNotice
