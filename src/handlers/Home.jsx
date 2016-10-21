/* global API_BASE_URL */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Button from 'components/Button'
import Icon from 'components/Icon'

class Home extends Component {

  static propTypes = {
    userId: PropTypes.string,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  componentWillMount() {
    // If the user is authenticated, immediately redirect to their room.
    const { userId } = this.props

    if (userId) {
      this.context.router.replace(userId)
    }
  }

  render() {
    return (
      <div className="Home">
        <h1>Blarg</h1>
        <p>Ramble with friends.</p>
        <Button
          component="a"
          href={`${API_BASE_URL}/authenticate`}
        ><Icon type="twitter" />Login with Twitter</Button>
      </div>
    )
  }
}

export default connect(
  ({ user }) => ({ userId: user.id })
)(Home)
