import React, { PropTypes } from 'react'

const EmptySeat = () => (
  <div>
    empty
  </div>
)

EmptySeat.propTypes = {
  isHost: PropTypes.bool.isRequired,
}

export default EmptySeat
