import React, { Component, PropTypes } from 'react'

class ModalButton extends Component {

  static propTypes = {
    modal: PropTypes.func.isRequired,
    modalProps: PropTypes.shape({}),
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
  }

  state = {
    showModal: false,
  }

  handleOnClick = () => (
    this.setState({ showModal: !this.state.showModal })
  )

  handleClose = () => (
    this.setState({ showModal: false })
  )

  handleContainerClick = (event) => {
    event.stopPropagation()
  }

  renderChildren = () => React.cloneElement(
    React.Children.only(this.props.children),
    { onClick: this.handleOnClick }
  )

  renderModalContainer() {
    const ModalComponent = this.props.modal
    return (
      <div className="Modal__backdrop" onClick={this.handleClose}>
        <div className="Modal__container" onClick={this.handleContainerClick}>
          <ModalComponent
            {...this.props.modalProps}
            onClose={this.handleClose}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <span className={this.props.className}>
        {this.renderChildren()}
        {this.state.showModal && this.renderModalContainer()}
      </span>
    )
  }
}

export default ModalButton
