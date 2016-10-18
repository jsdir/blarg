import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Viewers from 'components/Viewers'
import Comments from 'components/Comments'
import {
  join,
  leave,
  addComment,
} from 'actions'

class Room extends Component {

  static propTypes = {
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
    }).isRequired,
    join: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    room: PropTypes.shape({
      title: PropTypes.string.isRequired,
      viewers: PropTypes.arrayOf(PropTypes.string).isRequired,
      totalViewers: PropTypes.number.isRequired,
      activeViewers: PropTypes.number.isRequired,
      comments: PropTypes.array.isRequired,
    }),
    rooms: PropTypes.shape({
      userId: PropTypes.string,
    }).isRequired,
    addComment: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { userId } = this.props.params
    this.props.join(userId)
  }

  componentWillUnmount() {
    this.props.leave()
  }

  render() {
    const { room } = this.props
    return (
      <div className="Room">
        <div className="Room__header">
          <span className="Room__title">{room.title}</span>
          <Viewers
            viewers={room.viewers}
            totalViewers={room.totalViewers}
            activeViewers={room.activeViewers}
          />
        </div>
        <Comments
          userId={this.props.rooms.userId}
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
  activeViewers: 0,
}

export default connect(
  ({ rooms }, props) => ({
    rooms,
    room: rooms.rooms[props.params.userId]
      || defaultRoom,
  }), {
    join,
    leave,
    addComment,
  }
)(Room)
