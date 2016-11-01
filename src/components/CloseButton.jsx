import React, { PropTypes } from 'react'

import Icon from 'components/Icon'

const CloseButton = props => (
  <button
    className="CloseButton"
    onClick={props.onClick}
  >
    <Icon type="times" />
  </button>
)

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default CloseButton
