import React, { PropTypes } from 'react'

import Button from 'components/Button'
import Icon from 'components/Icon'

const CloseButton = props => (
  <Button onClick={props.onClick}>
    <Icon type="times" />
  </Button>
)

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default CloseButton
