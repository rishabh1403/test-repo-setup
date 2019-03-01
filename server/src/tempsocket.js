/* eslint-disable */

import socketio from 'socket.io';
import { gameConstants } from './utils/contants';
const {
  ROWS,
  COLS,
  EMPTY,
  SNAKE,
  FOOD,
  LEFT,
  UP,
  RIGHT,
  DOWN,
  KEY_LEFT,
  KEY_UP,
  KEY_RIGHT,
  KEY_DOWN,
} = gameConstants;
import Grid from './Grid';
import Snake from './Snake';
const gameData = {};

function joinRoomEvent(io, socket) {
  socket.on("joinRoom", (data) => {
    console.log(data);
    socket.join(data);

    console.log(io.sockets.adapter.rooms[data])
    if (io.sockets.adapter.rooms[data].length === 1) {
      initGame(data);
    }
    io.to(data).emit("Joined room", io.sockets.adapter.rooms[data]); // get everyone in room
  });
}

function initEvent(io, socket) {
  socket.on("init", () => {

    let data = Object.keys(socket.rooms)[1];
    // if (!gameData[data].initDone) {
    gameData[data].score = 0;

    if (io.sockets.adapter.rooms[data].length === 2) {
      let socketIDs = Object.keys(io.sockets.adapter.rooms[data].sockets);

      putSnakes(socketIDs, data);

      addNewFood(data);
    }

    gameData[data].initDone++;



    console.log("init fired");
    // console.log(gameData[data]);
  })
}

function changeDirectionEvent(socket){

  socket.on('changeDirection', (direction) => {
    let data = Object.keys(socket.rooms)[1]; // get the room we set
    if (socket.id === gameData[data].snake.id) {
      gameData[data].snake.direction = direction;
    } else {
      gameData[data].snake2.direction = direction;
    }

  })
}

function updateGameEvent(socket){
  socket.on('updateGame', () => {
    let data = Object.keys(socket.rooms)[1];
    let { nx, ny } = getNewSnakePosition(gameData[data].snake);
    let { nx: nx1, ny: ny1 } = getNewSnakePosition(gameData[data].snake2);
    if (isGameOver(nx, ny, nx1, ny1, gameData[data])) {
      gameData[data].initDone = 0;
      return socket.emit("gameOver");
    }
    let tail = getTail(data, nx, ny, 'snake')
    let tail1 = getTail(data, nx1, ny1, 'snake2')

    addTail(data, tail, tail1);

    socket.emit("draw", gameData[data].grid.grid);
  })
}

function disconnectingEvent(io, socket){
  socket.on('disconnecting', () => {
    console.log(Object.keys(socket.rooms)); // get the room we set
    io.to(Object.keys(socket.rooms)[1]).emit("Leave room");
  })
}
function keydownEvent(io, socket){
  socket.on('keydown', data => {
    io.to(Object.keys(socket.rooms)[0]).emit("keydown", data);
  })
}
function keyupEvent(io, socket){

  socket.on('keyup', data => {
    io.to(Object.keys(socket.rooms)[0]).emit("keyup", data);

  })
}

function setupEvents(io){
  io.on('connection', (socket) => {
    socket.emit('connected', "Hey");
    joinRoomEvent(io, socket);
    initEvent(io,socket);
    changeDirectionEvent(socket);
    updateGameEvent(socket);
    disconnectingEvent(io, socket);
    keydownEvent(io, socket);
    keyupEvent(io, socket);
  });
}

export const init = server => {
  const io = socketio.listen(server);
  setupEvents(io);
  

}


function putSnakes(socketIDs, data) {
  gameData[data].grid.init(EMPTY, COLS, ROWS);

  var sp = { x: Math.floor(COLS / 2), y: ROWS - 1 }
  gameData[data].snake.init(UP, sp.x, sp.y, socketIDs[0]);
  gameData[data].grid.set(SNAKE, sp.x, sp.y);

  sp = { x: COLS - 1, y: Math.floor(ROWS / 2) }
  gameData[data].snake2.init(LEFT, sp.x, sp.y, socketIDs[1]);
  gameData[data].grid.set(SNAKE, sp.x, sp.y);
}
function getTail(data, nx, ny, snake) {
  let tail = null;
  if (isNewPositionFood(nx, ny, gameData[data])) {
    gameData[data].score++;
    tail = { x: nx, y: ny }
    // setting food

    addNewFood(data);

  } else {
    tail = gameData[data][snake].remove();
    gameData[data].grid.set(EMPTY, tail.x, tail.y);
    tail.x = nx;
    tail.y = ny;
  }
  return tail;
}
function addNewFood(data) {
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
function addTail(data, tail, tail1) {
  gameData[data].grid.set(SNAKE, tail.x, tail.y);
  gameData[data].grid.set(SNAKE, tail1.x, tail1.y);
  gameData[data].snake.insert(tail.x, tail.y);
  gameData[data].snake2.insert(tail1.x, tail1.y);
}
function initGame(data) {
  gameData[data] = {};
  gameData[data].snake = new Snake();
  gameData[data].snake2 = new Snake();
  gameData[data].initDone = 0;
  gameData[data].grid = new Grid();
}
function isNewPositionFood(nx, ny, gameData) {
  return gameData.grid.get(nx, ny) === FOOD;
}
function getNewSnakePosition(snake) {
  var nx = snake.last.x;
  var ny = snake.last.y;
  switch (snake.direction) {
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
  return { nx, ny };
}
function isGameOver(nx, ny, nx1, ny1, gameData) {
  if (0 > nx || nx > gameData.grid.width - 1 ||
    0 > ny || ny > gameData.grid.height - 1 ||
    gameData.grid.get(nx, ny) === SNAKE
  ) {
    return true;
  }

  if (0 > nx1 || nx1 > gameData.grid.width - 1 ||
    0 > ny1 || ny1 > gameData.grid.height - 1 ||
    gameData.grid.get(nx1, ny1) === SNAKE
  ) {
    return true;
  }

  return false;
}