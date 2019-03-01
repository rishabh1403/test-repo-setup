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


//////////////////////////////////////

function connectedEvent(socket) {
  socket.emit('connected', "Hey");
}
function initGame(room) {
  gameData[room] = {};
  gameData[room].snake = new Snake();
  gameData[room].snake2 = new Snake();
  gameData[room].initDone = 0;
  gameData[room].grid = new Grid();
}


function joinRoomEvent(io, socket) {
  socket.on("joinRoom", (room) => {

    console.log(room);
    socket.join(room);

    console.log(io.sockets.adapter.rooms[room])
    if (io.sockets.adapter.rooms[room].length === 1) {
      initGame(room);
    }
    io.to(room).emit("Joined room", io.sockets.adapter.rooms[room]); // get everyone in room
  });
}

function addNewFood(room) {
  var empty = [];
  for (var x = 0; x < gameData[room].grid.width; x++) {
    for (var y = 0; y < gameData[room].grid.height; y++) {
      if (gameData[room].grid.get(x, y) === EMPTY) {
        empty.push({ x: x, y: y })
      }
    }
  }

  var randpos = empty[Math.floor(Math.random() * empty.length)];
  gameData[room].grid.set(FOOD, randpos.x, randpos.y);
}

function putSnakes(socketIDs, room) {
  gameData[room].grid.init(EMPTY, COLS, ROWS);

  var sp = { x: Math.floor(COLS / 2), y: ROWS - 1 }
  gameData[room].snake.init(UP, sp.x, sp.y, socketIDs[0]);
  gameData[room].grid.set(SNAKE, sp.x, sp.y);

  sp = { x: COLS - 1, y: Math.floor(ROWS / 2) }
  gameData[room].snake2.init(LEFT, sp.x, sp.y, socketIDs[1]);
  gameData[room].grid.set(SNAKE, sp.x, sp.y);
}

function initEvent(io, socket) {
  socket.on("init", () => {

    let room = Object.keys(socket.rooms)[1];
    // if (!gameData[data].initDone) {
    gameData[room].score = 0;

    if (io.sockets.adapter.rooms[room].length === 2) {
      let socketIDs = Object.keys(io.sockets.adapter.rooms[room].sockets);

      putSnakes(socketIDs, room);

      addNewFood(room);
    }

    gameData[room].initDone++;



    console.log("init fired");
    // console.log(gameData[data]);
  })
}

function setupEvents(io) {
  io.on('connection', (socket) => {
    connectedEvent(socket);
    joinRoomEvent(io, socket);
    initEvent(io, socket);
    changeDirectionEvent(socket);
    updateGameEvent(socket);
    disconnectingEvent(io, socket);
    keydownEvent(io, socket);
    keyupEvent(io, socket);
  });
}




function changeDirectionEvent(socket) {

  socket.on('changeDirection', (direction) => {
    let room = Object.keys(socket.rooms)[1]; // get the room we set
    if (socket.id === gameData[room].snake.id) {
      gameData[room].snake.direction = direction;
    } else {
      gameData[room].snake2.direction = direction;
    }

  })
}

function updateGameEvent(socket) {
  socket.on('updateGame', () => {
    let room = Object.keys(socket.rooms)[1];
    let { nx, ny } = getNewSnakePosition(gameData[room].snake);
    let { nx: nx1, ny: ny1 } = getNewSnakePosition(gameData[room].snake2);
    if (isGameOver(nx, ny, nx1, ny1, gameData[room])) {
      gameData[room].initDone = 0;
      return socket.emit("gameOver");
    }
    let tail = getTail(room, nx, ny, 'snake')
    let tail1 = getTail(room, nx1, ny1, 'snake2')

    addTail(room, tail, tail1);

    socket.emit("draw", gameData[room].grid.grid);
  })
}

function disconnectingEvent(io, socket) {
  socket.on('disconnecting', () => {
    console.log(Object.keys(socket.rooms)); // get the room we set
    io.to(Object.keys(socket.rooms)[1]).emit("Leave room");
  })
}
function keydownEvent(io, socket) {
  socket.on('keydown', data => {
    io.to(Object.keys(socket.rooms)[0]).emit("keydown", data);
  })
}
function keyupEvent(io, socket) {

  socket.on('keyup', data => {
    io.to(Object.keys(socket.rooms)[0]).emit("keyup", data);

  })
}




export const init = server => {
  const io = socketio.listen(server);
  setupEvents(io);


}



function getTail(room, nx, ny, snake) {
  let tail = null;
  if (isNewPositionFood(nx, ny, gameData[room])) {
    gameData[room].score++;
    tail = { x: nx, y: ny }
    // setting food

    addNewFood(room);

  } else {
    tail = gameData[room][snake].remove();
    gameData[room].grid.set(EMPTY, tail.x, tail.y);
    tail.x = nx;
    tail.y = ny;
  }
  return tail;
}

function addTail(room, tail, tail1) {
  gameData[room].grid.set(SNAKE, tail.x, tail.y);
  gameData[room].grid.set(SNAKE, tail1.x, tail1.y);
  gameData[room].snake.insert(tail.x, tail.y);
  gameData[room].snake2.insert(tail1.x, tail1.y);
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
function isNewPositionBorder(nx, ny, gameData) {
  return 0 > nx || nx > gameData.grid.width - 1 ||
    0 > ny || ny > gameData.grid.height - 1;
}
function isNewPositionSnake(nx, ny, gameData) {
  return gameData.grid.get(nx, ny) === SNAKE;
}
function isGameOver(nx, ny, nx1, ny1, gameData) {
  return isNewPositionBorder(nx, ny, gameData) || isNewPositionSnake(nx, ny, gameData) ||
    isNewPositionBorder(nx1, ny1, gameData) || isNewPositionSnake(nx1, ny1, gameData);
}