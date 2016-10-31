import React, { PropTypes } from 'react'

import Username from 'components/Username'
import UserPreviewButton from 'components/UserPreviewButton'

const renderUser = (username) => (
  <UserPreviewButton userId={username} className="User">
    <a>
      <img
        className="User__icon"
        src={`https://twitter.com/${username}/profile_image?size=normal`}
        alt={username}
      />
    </a>
  </UserPreviewButton>
)

const User = (props) => (props.showUsername ? (
  <span>
    {renderUser(props.username)}
    <Username username={props.username} />
  </span>
) : renderUser(props.username))

User.propTypes = {
  username: PropTypes.string.isRequired,
  showUsername: PropTypes.bool,
}

export default User
