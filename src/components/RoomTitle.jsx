import React, { Component, PropTypes } from 'react'

class RoomTitle extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string,
    isHost: PropTypes.bool.isRequired,
  }

  constructor(...args) {
    super(...args)

    this.state = { title: this.props.title }
  }

  setInputNode = (node) => {
    this.inputNode = node
  }

  handleChangeTitle = (event) => {
    this.setState({ title: event.target.value })
  }

  handleBlurTitle = (event) => {
    this.props.onChange(event.target.value)
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onChange(this.state.title)
    this.inputNode.blur()
  }

  render() {
    const content = this.props.isHost ? (
      <form onSubmit={this.handleSubmit}>
        <input
          ref={this.setInputNode}
          type="text"
          value={this.state.title}
          onChange={this.handleChangeTitle}
          onBlur={this.handleBlurTitle}
        />
      </form>
    ) : (
      <span>{this.props.title}</span>
    )

    return (
      <span className="Room__title">
        {content}
      </span>
    )
  }
}

export default RoomTitle
