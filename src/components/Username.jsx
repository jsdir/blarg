import React, { PropTypes } from 'react'

import UserPreviewButton from 'components/UserPreviewButton'

const Username = (props) => (
  <UserPreviewButton userId={props.username}>
    <a className="Username">
      @{props.username}{props.possessive && "'s"}
    </a>
  </UserPreviewButton>
)

Username.propTypes = {
  username: PropTypes.string.isRequired,
  possessive: PropTypes.bool,
}

export default Username
