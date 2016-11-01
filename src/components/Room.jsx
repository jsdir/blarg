import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ViewerInfo from 'components/ViewerInfo'
import ViewerList from 'components/ViewerList'
import Comments from 'components/Comments'
import {
  addComment,
  changeTitle,
} from 'actions'
import Username from 'components/Username'
import Seats from 'components/Seats'
import CallersPanel from 'components/CallersPanel'
import RoomTitle from 'components/RoomTitle'
import ProfileDropdown from 'components/ProfileDropdown'

class Room extends Component {

  static propTypes = {
    roomId: PropTypes.string.isRequired,
    userId: PropTypes.string,
    room: PropTypes.shape({
      title: PropTypes.string.isRequired,
      viewers: PropTypes.arrayOf(PropTypes.string).isRequired,
      totalViewers: PropTypes.number.isRequired,
      activeViewers: PropTypes.number.isRequired,
      comments: PropTypes.array.isRequired,
    }).isRequired,
    addComment: PropTypes.func.isRequired,
    changeTitle: PropTypes.func.isRequired,
  }

  addComment = (text) => {
    this.props.addComment({
      text,
      senderId: this.props.userId,
    })
  }

  render() {
    const { room, userId, roomId } = this.props
    const isHost = userId ? (userId === roomId) : false

    return (
      <div className="Room">
        <div className="Room__header">
          <RoomTitle
            isHost={isHost}
            title={room.title}
            onChange={this.props.changeTitle}
          />
          <ViewerInfo
            totalViewers={room.totalViewers}
            activeViewers={room.activeViewers}
          />
          <ViewerList viewers={room.viewers} />
          {userId && (<ProfileDropdown userId={userId} />)}
        </div>
        <div className="Room__body">
          {room.showCallers && (<CallersPanel />)}
          <div className="Room__content">
            {
              (this.props.room.viewers.indexOf(roomId) > -1) ? (
                <Seats
                  room={room}
                  isHost={isHost}
                  userId={userId}
                  roomId={roomId}
                />
              ) : (
                <div className="Room__absent">
                  <div className="Room__absent-icon">
                    :/
                  </div>
                  <div className="Room__absent-message">
                    <Username username={roomId} />
                    {' isn\'t here right now.'}
                  </div>
                </div>
              )
            }
          </div>
          <Comments
            userId={userId}
            roomId={roomId}
            comments={room.comments}
            onAddComment={this.addComment}
          />
        </div>
      </div>
    )
  }
}

export default connect(
  ({ user }) => ({ userId: user.id }), {
    addComment,
    changeTitle,
  }
)(Room)
