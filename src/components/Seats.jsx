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

  componentWillMount() {
    this.sl = new Skylink()
    this.sl.init(TEMASYS_APP_KEY)

    const { isHost } = this.props
    this.sl.joinRoom({
      useExactConstraints: true,
      audio: true,
      video: {
        resolution: {
          height: VIDEO_SIZE,
          width: VIDEO_SIZE,
        },
      },
      userData: {
        userId: this.props.userId,
      },
    })

    this.sl.muteStream({
      audioMuted: !isHost,
      videoMuted: !isHost,
    })
  }

  componentDidMount() {
    this.sl.on('mediaAccessSuccess', this.handleMediaAccessSuccess)
    this.sl.on('incomingStream', this.handleIncomingStream)
  }

  componentWillUnmount() {
    this.sl.leaveRoom()
  }

  setStream(userId, stream) {
    this.streams[userId] = stream

    if (this.props.roomId === userId) {
      this.seats[0].setMediaStream(stream)
    } else {
      const index = this.props.room.seats.indexOf(userId)
      if (index > -1) {
        this.seats[index + 1].setMediaStream(stream)
      }
    }
  }

  setSeatNode = (userId, i) => (node) => {
    if (!node) {
      return
    }

    this.seats[i] = node

    const stream = this.streams[userId]
    if (stream) {
      node.setMediaStream(stream)
    } else if (userId === this.props.userId) {
      this.sl.muteStream({
        audioMuted: false,
        videoMuted: false,
      })
    }
  }

  handleIncomingStream = (peerId, stream, isSelf, peerInfo) => {
    if (!isSelf) {
      this.setStream(peerInfo.userData.userId, stream)
    }
  }

  handleMediaAccessSuccess = (stream) => {
    this.setStream(this.props.userId, stream)
  }

  seats = {}
  streams = {}

  renderSeat = (seat, i) => (
    <Seat
      {...seat}
      key={seat.userId}
      ref={this.setSeatNode(seat.userId, i)}
    />
  )

  render() {
    const { roomId, userId, room, isHost } = this.props
    const seats = [{
      isHost: true,
      userId: roomId,
    }].concat(room.seats.map(seatUserId => ({
      userId: seatUserId,
      isHost: false,
    })))

    const showEmptySeat = (room.seats.length < MAX_GUESTS)
      && userId
      && (isHost || room.seats.indexOf(userId) === -1)

    return (
      <div className="Seats">
        {seats.map(this.renderSeat)}
        {
          showEmptySeat && (
            <EmptySeat
              isHost={isHost}
              userId={userId}
              callers={room.callers}
            />
          )
        }
      </div>
    )
  }
}

export default Seats
