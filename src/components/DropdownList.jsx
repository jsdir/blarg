/* eslint-env browser */

import React, { PropTypes, Component } from 'react'
import { findDOMNode } from 'react-dom'

export default
class DropdownList extends Component {

  static propTypes = {
    onOutsideClick: PropTypes.func.isRequired,
    children: PropTypes.node,
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClick)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClick)
  }

  handleClick = event => {
    if (!this.props.children) {
      return
    }

    // Hide the dropdown if there is a click outside
    // the component.
    const node = findDOMNode(this)
    let parentNode = event.target

    while (parentNode) {
      if (parentNode === node) {
        return
      }
      parentNode = parentNode.parentNode
    }

    this.props.onOutsideClick()
  }

  render = () => this.props.children && (
    <ul className="DropdownList">
      {this.props.children}
    </ul>
  )
}
