import React, { PropTypes } from 'react'
import { Link } from 'react-router'

const Username = (props) => {
  const Component = props.noLink
    ? 'span'
    : Link

  return (
    <Component
      className="Username"
      to={props.username}
    >
      @{props.username}{props.possessive && "'s"}
    </Component>
  )
}

Username.propTypes = {
  username: PropTypes.string,
  noLink: PropTypes.bool,
  possessive: PropTypes.bool,
}

export default Username
