import React, { PropTypes } from 'react'

const UserIcon = (props) => (
  <img
    className="User__icon"
    src={`https://twitter.com/${props.userId}/profile_image?size=normal`}
    alt={props.userId}
  />
)

UserIcon.propTypes = {
  userId: PropTypes.string.isRequired,
}

export default UserIcon
