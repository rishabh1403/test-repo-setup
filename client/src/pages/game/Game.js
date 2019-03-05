/* eslint-disable */

import React, { Component } from 'react';
import './entry.css';


// dimensions
const ROWS = 26, COLS = 26;

// Ids for grid
const EMPTY = 0, SNAKE = 1, FOOD = 2;

//Ids for direction
const LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;

// keycodes
const KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;

let canvas, ctx, keystate, frames, score, animationLoop;


class Game extends Component {

  state = {
    color : "#" + Math.random().toString(16).slice(2, 8),
  }

  loop() {
    this.update();
    const loop = this.loop.bind(this);
    animationLoop = window.requestAnimationFrame(loop, canvas);
  }

  update() {
    const { socket } = this.props;
    frames++;

    if (keystate[KEY_LEFT]) {
      socket.emit("changeDirection", LEFT);
    }
    if (keystate[KEY_UP]) {
      socket.emit("changeDirection", UP);
    }
    if (keystate[KEY_RIGHT]) {
      socket.emit("changeDirection", RIGHT);
    }
    if (keystate[KEY_DOWN]) {
      socket.emit("changeDirection", DOWN);
    }

    if (frames % 30 === 0) {
      socket.emit("updateGame");
    }

  }
  draw({grid,snakeColors}, id) {
    var tw = canvas.width / COLS;
    var th = canvas.height / ROWS;

    for (var x = 0; x < COLS; x++) {
      for (var y = 0; y < ROWS; y++) {
        switch (grid[x][y]) {
          case EMPTY:
            ctx.fillStyle = "#fff";
            break;
          case SNAKE:
            ctx.fillStyle = snakeColors[id];
            break;
          case FOOD:
            ctx.fillStyle = "#f00";
            break;
        }
        ctx.fillRect(x * tw, y * th, tw, th);
      }
    }
    ctx.fillStyle = "#000";
    ctx.fillText("score : " + score, 10, canvas.height - 10);
  }
  componentDidMount() {
    const { socket } = this.props;
    canvas = document.createElement("canvas");
    canvas.width = ROWS * 20;
    canvas.height = COLS * 20;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    frames = 0;
    keystate = {};
    document.addEventListener("keydown", function (evt) {
      keystate[evt.keyCode] = true
    })

    document.addEventListener("keyup", function (evt) {
      delete keystate[evt.keyCode];
    })
    socket.emit("init");
    socket.on('gameOver', () => {
      socket.emit("init");
    })
    socket.on("draw", (data) => {
      console.log(data);
      console.log(socket.id);
      this.draw(data, socket.id)
    })
    this.loop();
  }
  componentWillUnmount() {
    document.body.removeChild(canvas);
    window.cancelAnimationFrame(animationLoop);
  }
  render() {
    return (
      <div className="fix">
      </div>
    );
  }
}

export default Game;