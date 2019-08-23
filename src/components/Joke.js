import React, { Component } from 'react';
import './Joke.css';

export default class Joke extends Component {
  constructor(props) {
    super(props);
    this.upVote = this.upVote.bind(this);
    this.downVote = this.downVote.bind(this);
    this.getColor = this.getColor.bind(this);
    this.getSmiley = this.getSmiley.bind(this);
  }

  // Handle upvote click
  upVote() {
    this.props.handleUpVote(this.props.id);
  }

  // Handle downvote click
  downVote() {
    this.props.handleDownVote(this.props.id);
  }

  // get colors as per vote
  getColor() {
    if (this.props.upVote - this.props.downVote >= 15) {
      return '#4CAF50';
    } else if (this.props.upVote - this.props.downVote >= 12) {
      return '#8BC34A';
    } else if (this.props.upVote - this.props.downVote >= 9) {
      return '#CDDC39';
    } else if (this.props.upVote - this.props.downVote >= 6) {
      return '#FFEB3B';
    } else if (this.props.upVote - this.props.downVote >= 3) {
      return '#FFC107';
    } else if (this.props.upVote - this.props.downVote >= 0) {
      return '#FF9800';
    } else {
      return '#f44336';
    }
  }

  // get smilies as per vote
  getSmiley() {
    if (this.props.upVote - this.props.downVote >= 15) {
      return 'em em-rolling_on_the_floor_laughing';
    } else if (this.props.upVote - this.props.downVote >= 12) {
      return 'em em-laughing';
    } else if (this.props.upVote - this.props.downVote >= 9) {
      return 'em em-smiley';
    } else if (this.props.upVote - this.props.downVote >= 6) {
      return 'em em-slightly_smiling_face';
    } else if (this.props.upVote - this.props.downVote >= 3) {
      return 'em em-neutral_face';
    } else if (this.props.upVote - this.props.downVote >= 0) {
      return 'em em-confused';
    } else {
      return 'em em-angry';
    }
  }
  render() {
    return (
      <div className='Joke'>
        <div className='Joke-buttons'>
          <i className='fas fa-arrow-up' name='upVote' onClick={this.upVote} />
          <span className='Joke-votes' style={{ borderColor: this.getColor() }}>
            {this.props.upVote - this.props.downVote}
          </span>
          <i
            className='fas fa-arrow-down'
            name='downVote'
            onClick={this.downVote}
          />
        </div>
        <div className='Joke-text'>{this.props.text}</div>
        <div className='Joke-smiley'>
          <i className={this.getSmiley()} />
        </div>
      </div>
    );
  }
}
