import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import {
  join,
  leave,
} from 'actions'

class Room extends Component {

  static propTypes = {
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
    join: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    rooms: PropTypes.objectOf(PropTypes.shape({
      users: PropTypes.arrayOf(PropTypes.string).isRequired,
      totalUsers: PropTypes.number.isRequired,
    })),
  }

  componentWillMount() {
    const { username } = this.props.params
    this.props.join(username)
  }

  componentWillUnmount() {
    const { username } = this.props.params
    this.props.leave(username)
  }

  render() {
    const { username } = this.props.params
    const room = this.props.rooms
      && this.props.rooms[username]

    return room ? (
      <div className="Room">
        {room.isOwner}
      </div>
    ) : (
      <div>loading</div>
    )
  }
}

export default connect(null, {
  join,
  leave,
})(Room)
