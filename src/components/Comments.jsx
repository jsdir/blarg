import React, { Component, PropTypes } from 'react'

import Comment from 'components/Comment'
import EventNotice from 'components/EventNotice'

class Comments extends Component {

  static propTypes = {
    userId: PropTypes.string,
    comments: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
      user: PropTypes.string,
    })).isRequired,
    onAddComment: PropTypes.func.isRequired,
  }

  state = {
    commentText: '',
  }

  handleChangeCommentText = (event) => {
    this.setState({ commentText: event.target.value })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.props.onAddComment(this.state.commentText)
    this.setState({ commentText: '' })
  }

  renderComment = (comment, index) => {
    const CommentComponent = comment.event
      ? EventNotice
      : Comment

    return (
      <CommentComponent key={index} comment={comment} />
    )
  }

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
          Chat
        </div>
        <div className="Comments__list">
          {this.props.comments.map(this.renderComment)}
        </div>
        {this.props.userId && this.renderInput()}
      </div>
    )
  }
}

export default Comments
