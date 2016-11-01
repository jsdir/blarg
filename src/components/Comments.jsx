import React, { Component, PropTypes } from 'react'

import Comment from 'components/Comment'
import EventNotice from 'components/EventNotice'
import CommentInput from 'components/CommentInput'
import TwitterLogin from 'components/TwitterLogin'

class Comments extends Component {

  static propTypes = {
    userId: PropTypes.string,
    roomId: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
      user: PropTypes.string,
    })).isRequired,
    onAddComment: PropTypes.func.isRequired,
  }

  state = {
    unreadMessages: 0,
  }

  componentDidMount() {
    // Show the latest comments by default.
    this.scrollToBottom()
    this.node.addEventListener('scroll', this.handleScroll)
  }

  componentWillUpdate(nextProps) {
    const newCommentCount = nextProps.comments.length
    const oldCommentCount = this.props.comments.length
    if (newCommentCount > oldCommentCount) {
      this.shouldScroll = this.isScrolledToBottom()
      if (!this.shouldScroll) {
        this.setState({
          unreadMessages: this.state.unreadMessages + (
            newCommentCount - oldCommentCount
          ),
        })
      }
    }
  }

  componentDidUpdate() {
    if (this.shouldScroll) {
      this.scrollToBottom()
    }
    this.shouldScroll = false
  }

  componentWillUnmount() {
    this.node.removeEventListener('scroll', this.handleScroll)
  }

  setNode = (node) => {
    this.node = node
  }

  isScrolledToBottom = () => this.node.scrollTop === (
    this.node.scrollHeight - this.node.offsetHeight
  )

  scrollToBottom = () => {
    this.node.scrollTop = this.node.scrollHeight
  }

  showUnreadMessages = () => {
    this.scrollToBottom()
    this.setState({ unreadMessages: 0 })
  }

  handleAddComment = (commentText) => {
    this.props.onAddComment(commentText)
  }

  handleScroll = () => {
    if (this.isScrolledToBottom() && this.state.unreadMessages > 0) {
      this.setState({ unreadMessages: 0 })
    }
  }

  renderComment = (comment, index) => {
    const CommentComponent = comment.event
      ? EventNotice
      : Comment

    return (
      <CommentComponent key={index} comment={comment} />
    )
  }

  render() {
    return (
      <div className="Comments">
        <div className="Comments__list" ref={this.setNode}>
          {this.props.comments.map(this.renderComment)}
        </div>
        {this.state.unreadMessages > 0 && (
          <a
            className="Comments__unread"
            onClick={this.showUnreadMessages}
            tabIndex={0}
          >
            Show {this.state.unreadMessages} unread messages
          </a>
        )}
        {
          this.props.userId ? (
            <CommentInput onAddComment={this.handleAddComment} />
          ) : (
            <TwitterLogin
              roomId={this.props.roomId}
            >Login to Chat</TwitterLogin>
          )
        }
      </div>
    )
  }
}

export default Comments
