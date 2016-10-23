import React, { PropTypes } from 'react'

import Username from 'components/Username'

const User = props => (
  <a>
    <img
      className="User__icon"
      src={`https://twitter.com/${props.username}/profile_image?size=normal`}
      alt={props.username}
    />
    {props.showUsername && (<Username username={props.username} />)}
  </a>
)

User.propTypes = {
  username: PropTypes.string.isRequired,
  showUsername: PropTypes.bool,
}

export default User
