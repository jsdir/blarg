import _ from 'lodash'
import React, { PropTypes } from 'react'
import classnames from 'classnames'

const Button = props => {
  const Component = props.component

  return (
    <Component
      {..._.omit(props, 'component', 'primary')}
      className={classnames('Button', props.className, {
        'Button--primary': props.primary,
      })}
      onClick={() => props.onClick && props.onClick()}
    />
  )
}

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  onClick: PropTypes.func,
  primary: PropTypes.bool,
}

Button.defaultProps = {
  component: 'button',
}

export default Button
