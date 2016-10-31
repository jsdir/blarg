/* global OT */

import React, { PropTypes } from 'react'

import User from 'components/User'

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
  }

  componentDidMount() {
    const { userId, seatUserId, session } = this.props
    this.isMySeat = userId && (userId === seatUserId)
    if (this.isMySeat) {
      // Publish the stream if the session is connected.
      if (session.connection) {
        this.publish()
      } else {
        session.on('sessionConnected', this.publish)
      }
    } else {
      this.props.session.on('streamCreated', this.handleStreamCreated)
    }
  }

  componentWillUnmount() {
    if (!this.isMySeat) {
      this.props.session.off('streamCreated', this.handleStreamCreated)
    }
  }

  setVideoNode = (videoNode) => {
    this.videoNode = videoNode
  }

  handleStreamCreated = (event) => {
    // console.log('seat::handleStreamCreated', event.stream)
    const userId = event.stream.connection.data.replace('userId=', '')
    if (userId !== this.props.seatUserId) {
      return
    }

    const subscriber = this.props.session.subscribe(event.stream, null, {
      insertDefaultUI: false,
    })

    subscriber.once('videoElementCreated', this.handleVideoElementCreated)
  }

  publish = () => {
    const publisher = OT.initPublisher(null, {
      resolution: '640x480',
      insertDefaultUI: false,
    }, (error) => {
      if (error) throw error
    })

    publisher.once('videoElementCreated', this.handleVideoElementCreated)
    this.props.session.publish(publisher)
  }

  handleVideoElementCreated = (event) => {
    const { videoNode } = this
    while (videoNode.firstChild) {
      videoNode.removeChild(videoNode.firstChild)
    }
    videoNode.appendChild(event.element)
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
