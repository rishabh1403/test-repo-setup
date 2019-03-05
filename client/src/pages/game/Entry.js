/* eslint-disable */

import React, { Component } from 'react';

import io from 'socket.io-client';
import Game from './Game';
const socket = io('http://10.178.3.207:8000/');
// socket.emit("data", "hey");


class Entry extends Component {

  constructor(props) {
    super(props);
    this.state = {
      start: false,
    }
  }

  componentWillMount() {

  }
  componentDidMount() {
    socket.on("connected", (data) => {
      socket.emit("joinRoom", "abcdef");
    });

    socket.on("Joined room", (data) => {
      console.log(data);
      if (data.length === 2) {
        this.setState({
          start: true,
        })
      }
      console.log("joined rooomm");
    })
    socket.on("Leave room", (data) => {
      alert("your partner left the room :(");
      this.setState({
        start: false,
      })
    })
    
  }
  render() {
    return (
      <React.Fragment >
        {this.state.start && <Game socket={socket} />}
      </React.Fragment>
    );
  }
}

export default Entry;