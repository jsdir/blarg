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
    rooms: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
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
        {this.props.rooms.loading
          ? (<div>loading</div>)
          : this.props.children}
      </div>
    )
  }
}

export default connect(({ rooms }) => ({ rooms }), {
  connectFeed,
  disconnectFeed,
})(App)
