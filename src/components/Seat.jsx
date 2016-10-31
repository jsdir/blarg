/* global OT */

import React, { PropTypes } from 'react'

import User from 'components/User'

const VIDEO_SIZE = 300

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

    this.props.session.subscribe(event.stream, this.videoNode)
  }

  publish = () => {
    const publisher = OT.initPublisher(this.videoNode, {
      resolution: `${VIDEO_SIZE}x${VIDEO_SIZE}`,
      height: VIDEO_SIZE,
      width: VIDEO_SIZE,
      // insertDefaultUI: false,
    }, (error) => {
      if (error) throw error
    })

    this.props.session.publish(publisher)
  }

  render() {
    const { size } = this.props
    return (
      <div
        className="Seat Seat--opaque"
        style={{ height: size, width: size }}
      >
        <div
          ref={this.setVideoNode}
          height={480}
          width={480}
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
