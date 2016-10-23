/* global attachMediaStream */

import React, { PropTypes } from 'react'

import User from 'components/User'

class Seat extends React.Component {

  static propTypes = {
    userId: PropTypes.string.isRequired,
    isHost: PropTypes.bool.isRequired,
  }

  setVideoNode = (videoNode) => {
    this.videoNode = videoNode
  }

  setMediaStream(stream) {
    attachMediaStream(this.videoNode, stream)
  }

  render() {
    return (
      <div className="Seat">
        <div className="Seat__user">
          <User
            showUsername
            username={this.props.userId}
          />
        </div>
        <video
          autoPlay
          ref={this.setVideoNode}
          height={480}
          width={480}
        />
      </div>
    )
  }
}

export default Seat
