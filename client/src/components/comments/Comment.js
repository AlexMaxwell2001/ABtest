import React, { Component } from 'react';
import style from './style';
import marked from 'marked';
import StarRatings from "react-star-ratings";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toBeUpdated: false,
      text: '',
      rating: 0
    };
    //binding all our functions to this class
    this.deleteComment = this.deleteComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleCommentUpdate = this.handleCommentUpdate.bind(this);
    this.changeRating = this.changeRating.bind(this);
  }
  changeRating(rating) {
    this.setState({
      rating: rating
    })
  }
  updateComment(e) {
    e.preventDefault();
    //brings up the update field when we click on the update link.
    this.setState({ toBeUpdated: !this.state.toBeUpdated });
  }
  handleCommentUpdate(e) {
    e.preventDefault();
    let id = this.props.uniqueID;
    //if author or text changed, set it. if not, leave null and our PUT request
    //will ignore it.
    let text = (this.state.text) ? this.state.text : null;
    let rating = (this.state.rating) ? this.state.rating : null;
    let comment = {text: text, rating: rating};
    this.props.onCommentUpdate(id, comment);
    this.setState({
      toBeUpdated: !this.state.toBeUpdated,
      text: '',
      rating: 0
    })
  }
  deleteComment(e) {
    e.preventDefault();
    let id = this.props.uniqueID;
    this.props.onCommentDelete(id);
  }
  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }
  rawMarkup() {
    let rawMarkup = marked(this.props.children.toString());
    return { __html: rawMarkup };
  }
  render() {
    if(this.props.usersID === this.props.authorId){
      return (
        <div style={ style.comment }>
          <h4 style={{decoration: 'underline' }}dangerouslySetInnerHTML={ this.rawMarkup() } />
          <span>by <b>{this.props.author}(You)</b></span><br></br>
          <button className="btn btn-primary" style={{background:"green"}}onClick={ this.updateComment }>update</button>
          <button className="btn btn-danger" style={{margin:10}} onClick={ this.deleteComment }>delete</button>
          { (this.state.toBeUpdated)
            ? (<form onSubmit={ this.handleCommentUpdate }>
                <StarRatings
                      rating={this.state.rating}
                      isSelectable={true}
                      starRatedColor={'rgb(255, 206, 0)'}
                      starHoverColor={'rgb(255, 167, 0)'}
                      isAggregateRating={false}
                      changeRating={this.changeRating}
                      numOfStars={5}
                  />
                  <input
                  type='hidden'
                  value={ this.state.rating } />
                <input
                  type='text'
                  placeholder='Update your comment...'
                  style={ style.commentFormText }
                  value={ this.state.text }
                  onChange={ this.handleTextChange } />
                <button
                  type='submit'
                  className='btn btn-primary'
                  style={{ backgroundColor:"green"}}
                  disabled={this.state.text === "" || this.state.rating === 0}
                 >Update</button>
              </form>)
            : null}
        </div>
      )      
    } else {
      return (
        <div style={ style.comment }>
          <h3 style={{decoration: 'underline' }} dangerouslySetInnerHTML={ this.rawMarkup() } />
          <span>by <b>{this.props.author}</b></span><br></br>
        </div>
      )
    }
  }
}

export default Comment;