/* eslint-disable */

import React, { Component } from 'react';
import './App.css';



class Grid {

  init(d, c, r) {
    this.width = c;
    this.height = r;
    this._grid = [];

    for (var x = 0; x < c; x++) {
      this._grid.push([]);
      for (var y = 0; y < r; y++) {
        this._grid[x].push(d);
      }
    }
  }
  get grid() {
    return this._grid;
  }
  set grid(grid) {
    this._grid = JSON.parse(JSON.stringify(grid));
  }
  set(val, x, y) {
    this._grid[x][y] = val;
  }
  get(x, y) {
    return this._grid[x][y];
  }
}


class Snake {


  init(d, x, y) {

    this.direction = d;
    this._queue = [];
    this.insert(x, y);
  }
  insert(x, y) {
    this._queue.unshift({ x: x, y: y });
    this.last = this._queue[0];
  }
  remove() {
    return this._queue.pop();
  }
}

let grid = new Grid();
let snake = new Snake();
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

  loop() {
    this.update();
    const loop = this.loop.bind(this);
    animationLoop = window.requestAnimationFrame(loop, canvas);
  }

  update() {
    const { socket } = this.props;
    frames++;

    if (keystate[KEY_LEFT] && snake.direction !== RIGHT) {
      socket.emit("changeDirection", LEFT);
    }
    if (keystate[KEY_UP] && snake.direction !== DOWN) {
      socket.emit("changeDirection", UP);
    }
    if (keystate[KEY_RIGHT] && snake.direction !== LEFT) {
      socket.emit("changeDirection", RIGHT);
    }
    if (keystate[KEY_DOWN] && snake.direction !== UP) {
      socket.emit("changeDirection", DOWN);
    }

    if (frames % 20 === 0) {
      socket.emit("updateGame");
    }

  }
  draw(data) {
    var tw = canvas.width / COLS;
    var th = canvas.height / ROWS;

    for (var x = 0; x < COLS; x++) {
      for (var y = 0; y < ROWS; y++) {
        switch (data[x][y]) {
          case EMPTY:
            ctx.fillStyle = "#fff";
            break;
          case SNAKE:
            ctx.fillStyle = "#0ff";
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
      socket.emit("keydown", evt.keyCode);
    })

    document.addEventListener("keyup", function (evt) {
      socket.emit("keyup", evt.keyCode);
    })
    socket.on("keydown", data => {
      keystate[parseInt(data)] = true
    })
    socket.on("keyup", data => {
      delete keystate[parseInt(data)];
    })
    socket.emit("init");
    socket.on('gameOver', () => {
      socket.emit("init");
    })
    socket.on("draw", (data) => {
      this.draw(data)
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