import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import Icon from 'components/Icon'
import DropdownList from 'components/DropdownList'

class DropdownButton extends Component {

  static propTypes = {
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    noArrow: PropTypes.bool,
  }

  state = { active: false };

  toggle = event => {
    if (event) {
      event.stopPropagation()
    }

    this.setState({ active: !this.state.active })
  }

  renderArrow = () => (
    <Icon
      type={`caret-${this.state.active ? 'up' : 'down'}`}
    />
  )

  render() {
    const className = classnames(
      'DropdownButton', this.props.className
    )

    return (
      <div className={className}>
        <a
          className="DropdownButton__link"
          onClick={this.toggle}
          tabIndex={0}
        >
          {this.props.title}
          {this.props.noArrow ? null : ' '}
          {this.props.noArrow ? null : this.renderArrow()}
        </a>
        <DropdownList onOutsideClick={this.toggle}>
          {this.state.active && this.props.children}
        </DropdownList>
      </div>
    )
  }
}

export default DropdownButton
