import React, { PropTypes } from 'react'

import User from 'components/User'
import DropdownButton from 'components/DropdownButton'
import MenuItem from 'components/MenuItem'

const renderTitle = (userId) => (
  <User
    username={userId}
    showUsername
  />
)

const ProfileDropdown = (props) => (
  <DropdownButton title={renderTitle(props.userId)}>
    <MenuItem href="/">My Room</MenuItem>
    <MenuItem href="/v1/logout">Logout</MenuItem>
  </DropdownButton>
)

ProfileDropdown.propTypes = {
  userId: PropTypes.string.isRequired,
}

export default ProfileDropdown
