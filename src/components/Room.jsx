import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import Viewers from 'components/Viewers'
import Comments from 'components/Comments'
import {
  addComment,
  changeTitle,
} from 'actions'

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

  constructor(...args) {
    super(...args)

    const { room } = this.props
    this.state = { title: room.title }
  }

  handleChangeTitle = (event) => {
    this.setState({ title: event.target.value })
  }

  handleBlurTitle = (event) => {
    this.props.changeTitle(event.target.value)
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.changeTitle(this.state.title)
  }

  addComment = (text) => {
    this.props.addComment({
      text,
      senderId: this.props.userId,
    })
  }

  renderTitle(myRoom) {
    const { room } = this.props

    return myRoom ? (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.title}
          onChange={this.handleChangeTitle}
          onBlur={this.handleBlurTitle}
        />
      </form>
    ) : (
      <span>{room.title}</span>
    )
  }

  render() {
    const { room, userId, roomId } = this.props
    const myRoom = userId && userId === roomId

    return (
      <div className="Room">
        <div className="Room__header">
          <span className="Room__title">
            {this.renderTitle(myRoom)}
          </span>
          <Viewers
            viewers={room.viewers}
            totalViewers={room.totalViewers}
            activeViewers={room.activeViewers}
          />
          {userId && (<a href="/v1/logout">Logout</a>)}
        </div>
        <Comments
          userId={userId}
          comments={room.comments}
          onAddComment={this.addComment}
        />
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
