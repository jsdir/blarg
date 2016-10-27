import React, { PropTypes } from 'react'

import ModalButton from 'components/ModalButton'
import UserModal from 'components/UserModal'

const UserPreviewButton = props => (
  <ModalButton
    modal={UserModal}
    modalProps={{ userId: props.userId }}
  >
    {props.children}
  </ModalButton>
)

UserPreviewButton.propTypes = {
  userId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default UserPreviewButton
