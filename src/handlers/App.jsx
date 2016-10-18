import React, { Component, PropTypes } from 'react'

export default
class App extends Component {

  static propTypes = {
    children: PropTypes.node,
  }

  state = {}

  render() {
    return (
      <div className="App">
        {this.props.children}
      </div>
    )
  }
}
