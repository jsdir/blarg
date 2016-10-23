/* global TEMASYS_APP_KEY, attachMediaStream */
/* global Skylink */

import React, { PropTypes } from 'react'

import Seat from 'components/Seat'
import EmptySeat from 'components/EmptySeat'

const VIDEO_SIZE = 300
const MAX_GUESTS = 3

// http://cdn.temasys.com.sg/skylink/skylinkjs/latest/doc/classes/Skylink.html
class Seats extends React.Component {

  static propTypes = {
    isHost: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    roomId: PropTypes.string.isRequired,
    room: PropTypes.shape({
      seats: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
    }).isRequired,
  }

  componentDidMount() {
    this.sl = new Skylink()
    this.sl.init(TEMASYS_APP_KEY)

    const { isHost } = this.props
    this.sl.joinRoom({
      useExactConstraints: true,
      audio: isHost,
      video: isHost && {
        resolution: {
          height: VIDEO_SIZE,
          width: VIDEO_SIZE,
        },
      },
      userData: {
        userId: this.props.userId,
      },
    })

    if (isHost) {
      this.sl.on('mediaAccessSuccess', this.handleMediaAccessSuccess)
    } else {
      this.sl.on('incomingStream', this.handleIncomingStream)
    }
  }

  componentWillUnmount() {
    this.sl.leaveRoom()
  }

  seats = {}

  handleMediaAccessSuccess = (stream) => {
    if (this.props.isHost) {
      this.seats[0].setMediaStream(stream)
    }
  }

  handleIncomingStream = (peerId, stream, isSelf, peerInfo) => {
    setTimeout(() => {
      if (isSelf) {
        return
      }

      const userId = peerInfo.userId
      const index = this.props.roomId === userId
        ? 0
        : this.props.room.seats.indexOf(userId) + 1

      if (index < 0) {
        return
      }

      this.seats[index].setMediaStream(stream)
    }, 1000)
  }

  render() {
    const { roomId, room, isHost } = this.props
    const seats = [{
      isHost: true,
      userId: roomId,
    }].concat(room.seats.map(userId => ({
      userId,
      isHost: false,
    })))

    return (
      <div className="Seats">
        {
          seats.map((seat, i) => (
            <Seat
              {...seat}
              key={seat.userId}
              ref={(node) => { this.seats[i] = node }}
            />
          ))
        }
        {
          (room.seats.length < MAX_GUESTS) && (
            <EmptySeat isHost={isHost} />
          )
        }
      </div>
    )
  }
}

export default Seats
