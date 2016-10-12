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
    room: PropTypes.shape({
      title: PropTypes.string.isRequired,
      viewers: PropTypes.arrayOf(PropTypes.string).isRequired,
      totalViewers: PropTypes.number.isRequired,
      comments: PropTypes.array.isRequired,
    }),
    rooms: PropTypes.shape({
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

  render() {
    const { room } = this.props
    return (
      <div className="Room">
        <h1>{room.title}</h1>
        <Comments
          user={this.props.rooms.user}
          comments={room.comments}
          onAddComment={this.props.addComment}
        />
      </div>
    )
  }
}

const defaultRoom = {
  comments: [],
  title: 'untitled room',
  viewers: [],
  totalViewers: 0,
}

export default connect(
  ({ rooms }, props) => ({
    rooms,
    room: rooms.rooms[props.params.username]
      || defaultRoom,
  }), {
    join,
    leave,
    addComment,
  }
)(Room)
