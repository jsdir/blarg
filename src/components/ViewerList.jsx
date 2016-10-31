import React, { PropTypes } from 'react'

import User from 'components/User'

const renderViewer = username => (
  <User key={username} username={username} />
)

const ViewerList = props => (
  <div className="ViewerList">
    {props.viewers.map(renderViewer)}
  </div>
)

ViewerList.propTypes = {
  viewers: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default ViewerList
