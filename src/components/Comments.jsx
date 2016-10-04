import React, { Component, PropTypes } from 'react'

class Comments extends Component {

  static propTypes = {
    user: PropTypes.shape({}),
    comments: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
      user: PropTypes.string,
    })).isRequired,
    onSendComment: PropTypes.func.isRequired,
  }

  state = {
    commentText: '',
  }

  handleChangeCommentText = (event) => {
    event.preventDefault()
    event.stopImmediatePropagation()
    this.setState({ commentText: event.target.value })
  }

  handleSubmit = () => {
    this.props.onSendComment(this.state.commentText)
    this.setState({ commentText: null })
  }

  renderComment = (comment, index) => (
    <div key={index}>comment</div>
  )

  renderInput() {
    return (
      <form className="Comments__input" onSubmit={this.handleSubmit}>
        <input
          placeholder="Leave a comment..."
          onChange={this.handleChangeCommentText}
          value={this.state.commentText}
        />
      </form>
    )
  }

  render() {
    return (
      <div className="Comments">
        <div className="Comments__title">
          Comments
        </div>
        <div className="Comments__list">
          {this.props.comments.forEach(this.renderComment)}
        </div>
        {this.props.user && this.renderInput()}
      </div>
    )
  }
}

export default Comments
