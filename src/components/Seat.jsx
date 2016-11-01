/* global OT */

import React, { PropTypes } from 'react'

import User from 'components/User'
import CloseButton from 'components/CloseButton'

class Seat extends React.Component {

  static propTypes = {
    userId: PropTypes.string,
    seatUserId: PropTypes.string.isRequired,
    isHost: PropTypes.bool.isRequired,
    size: PropTypes.number.isRequired,
    session: PropTypes.shape({
      on: PropTypes.func.isRequired,
      off: PropTypes.func.isRequired,
      publish: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired,
    }).isRequired,
    leaveSeat: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { session } = this.props
    if (this.isMySeat()) {
      // Publish the stream if the session is connected.
      if (session.connection) {
        this.publish()
      } else {
        session.once('sessionConnected', this.publish)
      }
    } else {
      this.props.session.on('streamCreated', this.handleStreamCreated)
    }
  }

  componentWillUnmount() {
    const { session } = this.props

    if (!this.isMySeat) {
      this.props.session.off('streamCreated', this.handleStreamCreated)
    }

    if (this.publisher) {
      session.unpublish(this.publisher)
    }

    if (this.subscriber) {
      session.unsubscribe(this.subscriber)
    }
  }

  setVideoNode = (videoNode) => {
    this.videoNode = videoNode
  }

  handleStreamCreated = (event) => {
    const userId = event.stream.connection.data.replace('userId=', '')
    if (userId !== this.props.seatUserId) {
      return
    }

    this.subscriber = this.props.session.subscribe(event.stream, null, {
      insertDefaultUI: false,
    })

    this.subscriber.once('videoElementCreated', this.handleVideoElementCreated)
  }

  closeSeat = () => {
    this.props.leaveSeat(this.props.seatUserId)
  }

  isMySeat() {
    const { userId, seatUserId } = this.props
    return userId && (userId === seatUserId)
  }

  publish = () => {
    this.publisher = OT.initPublisher(null, {
      resolution: '640x480',
      insertDefaultUI: false,
    }, (error) => {
      if (error) throw error
    })

    this.publisher.once('videoElementCreated', this.handleVideoElementCreated)
    this.props.session.publish(this.publisher)
  }

  handleVideoElementCreated = (event) => {
    const { videoNode } = this
    if (!videoNode) {
      return
    }

    while (videoNode.firstChild) {
      videoNode.removeChild(videoNode.firstChild)
    }
    videoNode.appendChild(event.element)
  }

  renderCloseButton() {
    const isMySeat = this.isMySeat()
    return (this.props.isHost ? !isMySeat : isMySeat) && (
      <CloseButton onClick={this.closeSeat} />
    )
  }

  render() {
    const { size } = this.props
    return (
      <div
        className="Seat Seat--opaque"
        style={{ height: size, width: size }}
      >
        <div
          className="Seat__container"
          ref={this.setVideoNode}
        />
        {this.renderCloseButton()}
        <div className="Seat__user">
          <User
            showUsername
            username={this.props.seatUserId}
          />
        </div>
      </div>
    )
  }
}

export default Seat
