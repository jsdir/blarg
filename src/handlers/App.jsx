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
    session: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  }

  componentWillMount() {
    console.log(2342343)
    this.props.connectFeed()
  }

  componentWillUnmount() {
    this.props.disconnectFeed()
  }

  render() {
    return (
      <div className="App">
        {this.props.session.loading
          ? (<div>loading</div>)
          : this.props.children}
      </div>
    )
  }
}

export default connect(({ session }) => ({ session }), {
  connectFeed,
  disconnectFeed,
})(App)
