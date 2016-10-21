import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Room from 'components/Room'
import {
  join,
  leave,
} from 'actions'

class RoomLoader extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      roomId: PropTypes.string.isRequired,
    }).isRequired,
    join: PropTypes.func.isRequired,
    leave: PropTypes.func.isRequired,
    room: PropTypes.shape({}).isRequired,
  }

  componentWillMount() {
    const { roomId } = this.props.params
    this.props.join(roomId)
  }

  componentWillUnmount() {
    this.props.leave()
  }

  render() {
    const { room } = this.props
    if (room.loading) {
      return (<div>Loading room...</div>)
    } else if (room.error) {
      return (<div>You fail it.</div>)
    }

    return (<Room room={room} roomId={this.props.params.roomId} />)
  }
}

export default connect(
  ({ room }) => ({ room }), {
    join,
    leave,
  }
)(RoomLoader)
