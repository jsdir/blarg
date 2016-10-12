import React, { PropTypes } from 'react'

const User = props => (
  <a>
    <img
      className="User__icon"
      src={`https://twitter.com/${props.username}/profile_image?size=normal`}
      alt={props.username}
    />
  </a>
)

User.propTypes = {
  username: PropTypes.string.isRequired,
}

export default User
