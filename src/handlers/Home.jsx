/* global API_BASE_URL */

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Button from 'components/Button'
import Icon from 'components/Icon'

class Home extends Component {

  static propTypes = {
    authenticatedUser: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }),
    rooms: PropTypes.shape({
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
      }),
    }).isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  componentWillMount() {
    // If the user is authenticated, immediately redirect to their room.
    const { user } = this.props.rooms

    if (user) {
      this.context.router.replace(user.username)
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
  ({ rooms }) => ({ rooms })
)(Home)
