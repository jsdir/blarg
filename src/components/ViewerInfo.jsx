import React, { PropTypes } from 'react'

import Icon from 'components/Icon'

const ViewerInfo = (props) => (
  <div className="ViewerInfo">
    <span className="ViewerInfo__count">
      <Icon type="user" />{props.totalViewers}
    </span>
    <span className="ViewerInfo__count u-active">
      <Icon type="eye" />{props.activeViewers}
    </span>
  </div>
)

ViewerInfo.propTypes = {
  totalViewers: PropTypes.number.isRequired,
  activeViewers: PropTypes.number.isRequired,
}

export default ViewerInfo
