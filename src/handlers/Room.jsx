import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Comments from 'components/Comments'
import {
  join,
  leave,
  addComment,
} from 'actions'

class Room extends Component {

  static propTypes = {
    params: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
    join: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    room: PropTypes.objectOf(PropTypes.shape({
      users: PropTypes.arrayOf(PropTypes.string).isRequired,
      totalUsers: PropTypes.number.isRequired,
      // comments: PropTypes.array.isRequired,
    })),
    session: PropTypes.shape({
      user: PropTypes.any,
    }).isRequired,
    addComment: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { username } = this.props.params
    this.props.join(username)
  }

  componentWillUnmount() {
    this.props.leave()
  }

  addComment(text) {
    const { username } = this.props.params
    this.props.addComment(username, text)
  }

  render() {
    const { username } = this.props.params
    const { room } = this.props
    /* const room = this.props.rooms
     *   && this.props.rooms[username]
     */
    return (
      <div className="Room">
        {username} room
        <Comments
          user={this.props.session.user}
          comments={room.comments}
          onSendComment={this.props.addComment}
        />
      </div>
    )
  }
}

const defaultRoom = {
  comments: [],
  title: 'untitled room',
}

export default connect(
  ({ session, rooms }, props) => ({
    session,
    room: rooms.rooms[props.params.username]
      || defaultRoom,
  }), {
    join,
    leave,
    addComment,
  }
)(Room)
