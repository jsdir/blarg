import React, { PropTypes } from 'react'

const MenuItem = (props) => (
  <li>
    <a {...props}>
      {props.children}
    </a>
  </li>
)

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
}

export default MenuItem
