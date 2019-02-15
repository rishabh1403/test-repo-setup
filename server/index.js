/* eslint-disable */

const express = require('express');

const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000/',
  credentials: true,
}));
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const gameData = {};
// dimensions
const ROWS = 26, COLS = 26;

// Ids for grid
const EMPTY = 0, SNAKE = 1, FOOD = 2;


//Ids for direction
const LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;

// keycodes
const KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;

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


  init(d, x, y, id) {

    this.direction = d;
    this._queue = [];
    this.id = id;
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


io.on('connection', (socket) => {
  socket.emit('connected', "Hey");
  socket.on("joinRoom", (data) => {
    console.log(data);
    socket.join(data);
    console.log(io.sockets.adapter.rooms[data])
    if (io.sockets.adapter.rooms[data].length === 1) {
      gameData[data] = {};
      gameData[data].snake = new Snake();
      gameData[data].snake2 = new Snake();
      gameData[data].initDone = 0;
      gameData[data].grid = new Grid();

    }
    io.to(data).emit("Joined room", io.sockets.adapter.rooms[data]); // get everyone in room
  });

  socket.on("init", () => {

    let data = Object.keys(socket.rooms)[1];
    // if (!gameData[data].initDone) {
    gameData[data].score = 0;

    if (io.sockets.adapter.rooms[data].length === 2) {
      let socketIDs = Object.keys(io.sockets.adapter.rooms[data].sockets);
      gameData[data].grid.init(EMPTY, COLS, ROWS);

      var sp = { x: Math.floor(COLS / 2), y: ROWS - 1 }
      gameData[data].snake.init(UP, sp.x, sp.y, socketIDs[0]);
      gameData[data].grid.set(SNAKE, sp.x, sp.y);

      sp = { x: COLS - 1, y: Math.floor(ROWS / 2) }
      gameData[data].snake2.init(LEFT, sp.x, sp.y, socketIDs[1]);
      gameData[data].grid.set(SNAKE, sp.x, sp.y);

      var empty = [];

      for (var x = 0; x < gameData[data].grid.width; x++) {
        for (var y = 0; y < gameData[data].grid.height; y++) {
          if (gameData[data].grid.get(x, y) === EMPTY) {
            empty.push({ x: x, y: y })
          }
        }
      }

      var randpos = empty[Math.floor(Math.random() * empty.length)];
      gameData[data].grid.set(FOOD, randpos.x, randpos.y);
    }

    gameData[data].initDone++;



    console.log("init fired");
    // console.log(gameData[data]);
  })

  socket.on('changeDirection', (direction) => {
    let data = Object.keys(socket.rooms)[1]; // get the room we set
    if(socket.id === gameData[data].snake.id){
      gameData[data].snake.direction = direction;
    }else{
      gameData[data].snake2.direction = direction;
    }
    
  })

  socket.on('updateGame', () => {
    let data = Object.keys(socket.rooms)[1];
    var nx = gameData[data].snake.last.x;
    var ny = gameData[data].snake.last.y;

    var nx1 = gameData[data].snake2.last.x;
    var ny1 = gameData[data].snake2.last.y;
    switch (gameData[data].snake.direction) {
      case LEFT:
        nx--
        break;
      case UP:
        ny--;
        break;
      case RIGHT:
        nx++;
        break;
      case DOWN:
        ny++;
        break;
    }
    switch (gameData[data].snake2.direction) {
      case LEFT:
        nx1--
        break;
      case UP:
        ny1--;
        break;
      case RIGHT:
        nx1++;
        break;
      case DOWN:
        ny1++;
        break;
    }
    if (0 > nx || nx > gameData[data].grid.width - 1 ||
      0 > ny || ny > gameData[data].grid.height - 1 ||
      gameData[data].grid.get(nx, ny) === SNAKE
    ) {
      gameData[data].initDone = 0;
      return socket.emit("gameOver");
    }
    if (0 > nx1 || nx1 > gameData[data].grid.width - 1 ||
      0 > ny1 || ny1 > gameData[data].grid.height - 1 ||
      gameData[data].grid.get(nx1, ny1) === SNAKE
    ) {
      gameData[data].initDone = 0;
      return socket.emit("gameOver");
    }
    let tail = null, tail1 = null;
    if (gameData[data].grid.get(nx, ny) === FOOD) {
      gameData[data].score++;
      tail = { x: nx, y: ny }
      // setting food

      var empty = [];

      for (var x = 0; x < gameData[data].grid.width; x++) {
        for (var y = 0; y < gameData[data].grid.height; y++) {
          if (gameData[data].grid.get(x, y) === EMPTY) {
            empty.push({ x: x, y: y })
          }
        }
      }

      var randpos = empty[Math.floor(Math.random() * empty.length)];
      gameData[data].grid.set(FOOD, randpos.x, randpos.y);

    } else {
      tail = gameData[data].snake.remove();
      gameData[data].grid.set(EMPTY, tail.x, tail.y);
      tail.x = nx;
      tail.y = ny;
    }

    if (gameData[data].grid.get(nx1, ny1) === FOOD) {
      gameData[data].score++;
      tail1 = { x: nx1, y: ny1 }
      // setting food

      var empty = [];

      for (var x = 0; x < gameData[data].grid.width; x++) {
        for (var y = 0; y < gameData[data].grid.height; y++) {
          if (gameData[data].grid.get(x, y) === EMPTY) {
            empty.push({ x: x, y: y })
          }
        }
      }

      var randpos = empty[Math.floor(Math.random() * empty.length)];
      gameData[data].grid.set(FOOD, randpos.x, randpos.y);

    } else {
      tail1 = gameData[data].snake2.remove();
      gameData[data].grid.set(EMPTY, tail1.x, tail1.y);

      tail1.x = nx1;
      tail1.y = ny1;
    }

    gameData[data].grid.set(SNAKE, tail.x, tail.y);
    gameData[data].grid.set(SNAKE, tail1.x, tail1.y);
    gameData[data].snake.insert(tail.x, tail.y);
    gameData[data].snake2.insert(tail1.x, tail1.y);
    socket.emit("draw", gameData[data].grid.grid);
  })

  socket.on('disconnecting', () => {
    console.log(Object.keys(socket.rooms)); // get the room we set
    io.to(Object.keys(socket.rooms)[1]).emit("Leave room");
  })

  socket.on('keydown', data => {
    io.to(Object.keys(socket.rooms)[0]).emit("keydown", data);
  })

  socket.on('keyup', data => {
    io.to(Object.keys(socket.rooms)[0]).emit("keyup", data);

  })
});


server.listen('8000', () => console.log('Server listening on port 8000')); // eslint-disable-line
