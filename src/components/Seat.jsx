/* global attachMediaStream */

import React, { PropTypes } from 'react'

import User from 'components/User'

class Seat extends React.Component {

  static propTypes = {
    userId: PropTypes.string.isRequired,
    isHost: PropTypes.bool.isRequired,
    size: PropTypes.number.isRequired,
  }

  setVideoNode = (videoNode) => {
    this.videoNode = videoNode
  }

  setMediaStream(stream) {
    attachMediaStream(this.videoNode, stream)
  }

  render() {
    const { size } = this.props
    return (
      <div
        className="Seat Seat--opaque"
        style={{ height: size, width: size }}
      >
        <video
          autoPlay
          ref={this.setVideoNode}
          height={480}
          width={480}
        />
        <div className="Seat__user">
          <User
            showUsername
            username={this.props.userId}
          />
        </div>
      </div>
    )
  }
}

export default Seat
