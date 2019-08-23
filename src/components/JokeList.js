import React, { Component } from 'react';
import axios from 'axios';
import Joke from './Joke';
import './JokeList.css';

export default class JokeList extends Component {
  static defaultProps = {
    numOfJokesToGet: 10
  };
  constructor(props) {
    super(props);
    this.handleUpVote = this.handleUpVote.bind(this);
    this.handleDownVote = this.handleDownVote.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this._initialState = JSON.parse(localStorage.getItem('jokes') || '[]');
    this.state = {
      jokes: this._initialState.sort(
        (a, b) => b.upVote - b.downVote - (a.upVote - a.downVote)
      ),
      isLoading: false
    };

    // Making a SET from the jokes we already have in STATE. IMP: Can't declare seenJokes before STATE.
    this.seenJokes = new Set(this.state.jokes.map(j => j.id));
  }

  // Component did mount method - managed by react.
  componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.setState({ isLoading: true }, this.getJokes);
    }
  }

  // Getiing Jokes from API
  async getJokes() {
    try {
      let jokes = [];
      while (jokes.length < this.props.numOfJokesToGet) {
        const res = await axios.get('https://icanhazdadjoke.com/', {
          headers: {
            Accept: 'application/json'
          }
        });
        const jokeObj = { ...res.data, upVote: 0, downVote: 0 };

        // Checking if our set already have fetched jokes
        if (!this.seenJokes.has(jokeObj.id)) {
          this.seenJokes.add(jokeObj.id);
          jokes.push(jokeObj); // if we don't have it, pushing fetched joke to ARRAY.
        } else {
          console.log('FOUND A DUPLIACTE JOKE:  ', jokeObj.joke);
        }
      }
      this.setState(
        st => ({ jokes: [...st.jokes, ...jokes], isLoading: false }),
        () => localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
      );
    } catch (error) {
      alert(error);
      this.setState({ isLoading: false });
    }
  }

  // Handle up vote
  handleUpVote(id) {
    const updatedVotes = this.state.jokes.map(joke =>
      joke.id === id ? { ...joke, upVote: joke.upVote + 1 } : joke
    );
    this.setState(
      {
        jokes: updatedVotes
      },
      () => localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    );
  }

  // Handle down vote
  handleDownVote(id) {
    const updatedVotes = this.state.jokes.map(joke =>
      joke.id === id ? { ...joke, downVote: joke.downVote + 1 } : joke
    );
    this.setState(
      {
        jokes: updatedVotes
      },
      () => localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
    );
  }

  // handle "get new jokes" button working
  handleClick() {
    this.setState({ isLoading: true }, this.getJokes);
  }

  // render method
  render() {
    if (this.state.isLoading) {
      return (
        <div className='JokeList-spinner'>
          <i className='far fa-8x fa-laugh fa-spin' />
          <h1 className='JokeList-title'>Loading...</h1>
        </div>
      );
    }
    return (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
          <h1 className='JokeList-title'>
            <span>Dad</span> Jokes
          </h1>
          <img
            src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg'
            alt='smiley'
          />
          <button className='JokeList-getmore' onClick={this.handleClick}>
            New Jokes
          </button>
        </div>

        <div className='JokeList-jokes'>
          {this.state.jokes.map(j => (
            <Joke
              text={j.joke}
              upVote={j.upVote}
              downVote={j.downVote}
              key={j.id}
              id={j.id}
              handleUpVote={this.handleUpVote}
              handleDownVote={this.handleDownVote}
            />
          ))}
        </div>
      </div>
    );
  }
}
