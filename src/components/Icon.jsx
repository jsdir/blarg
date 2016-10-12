import React, { PropTypes } from 'react'

const Icon = props => (
  <i className={`Icon fa fa-${props.type}`} />
)

Icon.propTypes = {
  type: PropTypes.string.isRequired,
}

export default Icon
