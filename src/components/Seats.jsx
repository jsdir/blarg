/* eslint-env browser */
/* global OT */

import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Seat from 'components/Seat'
import EmptySeat from 'components/EmptySeat'
import { leaveSeat } from 'actions'

const MAX_GUESTS = 3
const SEAT_MARGIN = 12
const CONTAINER_SIZE_DIFF = 60
const SEAT_SIZE_DIFF = SEAT_MARGIN * 2

class Seats extends React.Component {

  static propTypes = {
    isHost: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    roomId: PropTypes.string.isRequired,
    room: PropTypes.shape({
      seats: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
      token: PropTypes.string.isRequired,
      tokBoxKey: PropTypes.string.isRequired,
      sessionId: PropTypes.string.isRequired,
    }).isRequired,
    leaveSeat: PropTypes.func.isRequired,
  }

  state = {
    containerSize: 0,
    size: false,
  }

  componentWillMount() {
    const { tokBoxKey, sessionId, token } = this.props.room
    this.session = OT.initSession(tokBoxKey, sessionId)
    this.session.connect(token, (error) => {
      if (error) {
        throw error
        // return
      }
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  setSeatsNode = (node) => {
    this.node = node
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

  renderSeat = (seat) => (
    <Seat
      {...seat}
      session={this.session}
      size={this.state.size}
      userId={this.props.userId}
      key={seat.seatUserId}
      leaveSeat={this.props.leaveSeat}
      isHost={this.props.isHost}
    />
  )

  render() {
    const { size, containerSize } = this.state

    const { roomId, userId, room, isHost } = this.props
    const seats = [{
      // isHost: true,
      seatUserId: roomId,
    }].concat(room.seats.map(seatUserId => ({
      seatUserId,
      // isHost: false,
    })))

    const showEmptySeat = (room.seats.length < MAX_GUESTS)
      && userId
      && (isHost || room.seats.indexOf(userId) === -1)

    return (
      <div className="Seats" ref={this.setSeatsNode}>
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
                seatCount={room.seats.length}
              />
            )
          }
        </div>
      </div>
    )
  }
}

export default connect(null, {
  leaveSeat,
})(Seats)
