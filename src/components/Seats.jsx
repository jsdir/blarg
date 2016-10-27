/* eslint-env browser */
/* global TEMASYS_APP_KEY, attachMediaStream */
/* global Skylink */

import React, { PropTypes } from 'react'

import Seat from 'components/Seat'
import EmptySeat from 'components/EmptySeat'

const VIDEO_SIZE = 300
const MAX_GUESTS = 3
const SEAT_MARGIN = 12
const CONTAINER_SIZE_DIFF = 60
const SEAT_SIZE_DIFF = SEAT_MARGIN * 2

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

  state = {
    containerSize: 0,
    size: false,
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
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount() {
    this.sl.leaveRoom()
    window.removeEventListener('resize', this.handleResize)
  }

  setNode = (node) => {
    this.node = node
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
    this.seats[i] = node

    if (!node || this.seatUsers[userId]) {
      return
    }

    const stream = this.streams[userId]
    if (stream) {
      node.setMediaStream(stream)
    } else if (userId === this.props.userId) {
      this.sl.muteStream({
        audioMuted: false,
        videoMuted: false,
      })
    }

    this.seatUsers[userId] = true
  }

  seatUsers = {}

  handleIncomingStream = (peerId, stream, isSelf, peerInfo) => {
    if (!isSelf) {
      this.setStream(peerInfo.userData.userId, stream)
    }
  }

  handleMediaAccessSuccess = (stream) => {
    setTimeout(() => {
      this.setStream(this.props.userId, stream)
    }, 1000)
  }

  handleResize = () => {
    if (!this.node) {
      return
    }

    const rect = this.node.getBoundingClientRect()
    const containerSize = Math.min(rect.height, rect.width) - CONTAINER_SIZE_DIFF
    const size = Math.floor(containerSize / 2) - SEAT_SIZE_DIFF
    this.setState({ size, containerSize })
  }

  seats = {}
  streams = {}

  renderSeat = (seat, i) => (
    <Seat
      {...seat}
      size={this.state.size}
      key={seat.userId}
      ref={this.setSeatNode(seat.userId, i)}
    />
  )

  render() {
    const { size, containerSize } = this.state

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
      <div className="Seats" ref={this.setNode}>
        <div
          className="Seats__container"
          style={{ height: containerSize, width: containerSize }}
        >
          {size && seats.map(this.renderSeat)}
          {
            size && showEmptySeat && (
              <EmptySeat
                size={size}
                isHost={isHost}
                userId={userId}
                callers={room.callers}
              />
            )
          }
        </div>
      </div>
    )
  }
}

export default Seats
