import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  connectFeed,
  disconnectFeed,
} from 'actions'

class App extends Component {

  static propTypes = {
    connectFeed: PropTypes.func.isRequired,
    disconnectFeed: PropTypes.func.isRequired,
    children: PropTypes.node,
    user: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
  }

  componentWillMount() {
    this.props.connectFeed()
  }

  componentWillUnmount() {
    this.props.disconnectFeed()
  }

  render() {
    return (
      <div className="App">
        {this.props.user === null ? (<div>loading</div>) : this.props.children}
      </div>
    )
  }
}

export default connect(({ user }) => ({ user }), {
  connectFeed,
  disconnectFeed,
})(App)
