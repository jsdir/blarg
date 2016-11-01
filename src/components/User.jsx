import React, { PropTypes } from 'react'

import Username from 'components/Username'
import UserPreviewButton from 'components/UserPreviewButton'
import UserIcon from 'components/UserIcon'

const renderUser = (username) => (
  <UserPreviewButton userId={username} className="User">
    <a>
      <UserIcon userId={username} />
    </a>
  </UserPreviewButton>
)

const User = (props) => (props.showUsername ? (
  <span className="UserGroup">
    {renderUser(props.username)}
    <Username username={props.username} />
  </span>
) : renderUser(props.username))

// TODO: add `shouldComponentUpdate`

User.propTypes = {
  username: PropTypes.string.isRequired,
  showUsername: PropTypes.bool,
}

export default User

// TODO: reorganize users
