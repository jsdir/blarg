import React, { PropTypes } from 'react'

import User from 'components/User'
import Icon from 'components/Icon'

const renderViewer = username => (
  <User key={username} username={username} />
)

const Viewers = props => (
  <div className="Viewers">
    <span className="Viewers__count">
      <Icon type="user" />{props.totalViewers}
    </span>
    <span className="Viewers__count">
      <Icon type="eye" />{props.activeViewers}
    </span>
    {props.viewers.map(renderViewer)}
  </div>
)

Viewers.propTypes = {
  viewers: PropTypes.arrayOf(PropTypes.string).isRequired,
  totalViewers: PropTypes.number.isRequired,
  activeViewers: PropTypes.number.isRequired,
}

export default Viewers
