import React, { Component, PropTypes } from 'react'

class CommentInput extends Component {

  static propTypes = {
    onAddComment: PropTypes.func.isRequired,
  }

  state = {
    commentText: '',
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (!this.state.commentText) {
      return
    }
    this.props.onAddComment(this.state.commentText)
    this.setState({ commentText: '' })
  }

  handleChangeCommentText = (event) => {
    this.setState({ commentText: event.target.value })
  }

  render() {
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
}

export default CommentInput
