import React, { PropTypes } from 'react'

import UserIcon from 'components/UserIcon'
import CloseButton from 'components/CloseButton'
import Icon from 'components/Icon'
import Button from 'components/Button'

const UserModal = (props) => (
  <div className="UserModal">
    <CloseButton onClick={props.onClose} />
    <div className="UserModal__header">
      <UserIcon userId={props.userId} />
      <span className="UserModal__username">@{props.userId}</span>
      <a
        href={`https://twitter.com/${props.userId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon type="twitter" />
      </a>
    </div>
    <div className="UserModal__actions">
      <Button primary component="a" href={props.userId}>
        {`Visit @${props.userId}'s Room`}
      </Button>
    </div>
  </div>
)

UserModal.propTypes = {
  userId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default UserModal
