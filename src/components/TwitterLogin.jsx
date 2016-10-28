/* global API_BASE_URL */

import React, { PropTypes } from 'react'

import Button from 'components/Button'
import Icon from 'components/Icon'

const TwitterLogin = (props) => {
  const params = props.roomId ? `?roomId=${props.roomId}` : ''
  return (
    <Button
      component="a"
      href={`${API_BASE_URL}/authenticate${params}`}
    ><Icon type="twitter" />
      {props.children || 'Login with Twitter'}
    </Button>
  )
}

TwitterLogin.propTypes = {
  children: PropTypes.node,
  roomId: PropTypes.string,
}

export default TwitterLogin
