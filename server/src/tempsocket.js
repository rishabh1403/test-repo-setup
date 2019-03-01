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

export const init = server => {
  const io = socketio.listen(server);
  setupEvents(io);
}

function getUserGameRoom(socket) {
  return Object.keys(socket.rooms)[1];
}

function connectedEvent(socket) {
  socket.emit('connected', "Hey");
}

function initGame(room) {
  gameData[room] = {};
  gameData[room].snake = new Snake();
  gameData[room].opponentSnake = new Snake();
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

function getEmptyCells(room) {
  
  const empty = new Array(gameData[room].grid.width).fill()
    .reduce((acc, el, x) => {
      const newRow = new Array(gameData[room].grid.height).fill()
        .reduce((acc, el, y) => {
          if (gameData[room].grid.get(x, y) === EMPTY) {
          return [...acc, { x, y }];
          }
          return [...acc];
        }, [])
      return [...acc, ...newRow]
    }, [])
  return empty;
}

function addNewFood(room) {

  let empty = getEmptyCells(room);
  var randpos = empty[Math.floor(Math.random() * empty.length)];
  gameData[room].grid.set(FOOD, randpos.x, randpos.y);
}

function putSnakes(socketIDs, room) {
  gameData[room].grid.init(EMPTY, COLS, ROWS);

  var sp = { x: Math.floor(COLS / 2), y: ROWS - 1 }
  gameData[room].snake.init(UP, sp.x, sp.y, socketIDs[0]);
  gameData[room].grid.set(SNAKE, sp.x, sp.y);

  sp = { x: COLS - 1, y: Math.floor(ROWS / 2) }
  gameData[room].opponentSnake.init(LEFT, sp.x, sp.y, socketIDs[1]);
  gameData[room].grid.set(SNAKE, sp.x, sp.y);
}

function initEvent(io, socket) {
  socket.on("init", () => {
    let room = getUserGameRoom(socket);
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
    let room = getUserGameRoom(socket);
    if (socket.id === gameData[room].snake.id) {
      gameData[room].snake.direction = direction;
    } else {
      gameData[room].opponentSnake.direction = direction;
    }

  })
}

function updateGameEvent(socket) {
  socket.on('updateGame', () => {
    let room = getUserGameRoom(socket);
    let snakeNewPosition = getNewSnakePosition(gameData[room].snake);
    let opponentSnakeNewPosition = getNewSnakePosition(gameData[room].opponentSnake);
    if (isGameOver(snakeNewPosition, opponentSnakeNewPosition, gameData[room])) {
      gameData[room].initDone = 0;
      return socket.emit("gameOver");
    }
    let tail = getTail(room, snakeNewPosition, 'snake')
    let opponentSnakeTail = getTail(room, opponentSnakeNewPosition, 'opponentSnake')

    addTail(room, tail, opponentSnakeTail);

    socket.emit("draw", gameData[room].grid.grid);
  })
}

function disconnectingEvent(io, socket) {
  socket.on('disconnecting', () => {
    io.to(getUserGameRoom(socket)).emit("Leave room");
  })
}

function setupKeyChangeEvents(io, socket, key) {
  socket.on(key, data => {
    io.to(Object.keys(socket.rooms)[0]).emit(key, data);
  })
}

function keydownEvent(io, socket) {
  setupKeyChangeEvents(io, socket, "keydown")
}

function keyupEvent(io, socket) {
  setupKeyChangeEvents(io, socket, "keyup")
}

function getTail(room, snakeNewPosition, snake) {
  let tail = null;
  if (isNewPositionFood(snakeNewPosition.x, snakeNewPosition.y, gameData[room])) {
    gameData[room].score++;
    tail = { x: snakeNewPosition.x, y: snakeNewPosition.y }
    // setting food

    addNewFood(room);

  } else {
    tail = gameData[room][snake].remove();
    gameData[room].grid.set(EMPTY, tail.x, tail.y);
    tail.x = snakeNewPosition.x;
    tail.y = snakeNewPosition.y;
  }
  return tail;
}

function addTail(room, tail, opponentSnakeTail) {
  gameData[room].grid.set(SNAKE, tail.x, tail.y);
  gameData[room].grid.set(SNAKE, opponentSnakeTail.x, opponentSnakeTail.y);
  gameData[room].snake.insert(tail.x, tail.y);
  gameData[room].opponentSnake.insert(opponentSnakeTail.x, opponentSnakeTail.y);
}

function isNewPositionFood(snakeNewPositionX, snakeNewPositionY, gameData) {
  return gameData.grid.get(snakeNewPositionX, snakeNewPositionY) === FOOD;
}

function getNewSnakePosition(snake) {
  var x = snake.last.x;
  var y = snake.last.y;
  switch (snake.direction) {
    case LEFT:
      x--
      break;
    case UP:
      y--;
      break;
    case RIGHT:
      x++;
      break;
    case DOWN:
      y++;
      break;
  }
  return { x, y };
}

function isNewPositionBorder(snakeNewPositionX, snakeNewPositionY, gameData) {
  return 0 > snakeNewPositionX || snakeNewPositionX > gameData.grid.width - 1 ||
    0 > snakeNewPositionY || snakeNewPositionY > gameData.grid.height - 1;
}

function isNewPositionSnake(snakeNewPositionX, snakeNewPositionY, gameData) {
  return gameData.grid.get(snakeNewPositionX, snakeNewPositionY) === SNAKE;
}

function isGameOver(snakeNewPosition, opponentSnakeNewPosition, gameData) {
  return isNewPositionBorder(snakeNewPosition.x, snakeNewPosition.y, gameData) ||
    isNewPositionSnake(snakeNewPosition.x, snakeNewPosition.y, gameData) ||
    isNewPositionBorder(opponentSnakeNewPosition.x, opponentSnakeNewPosition.y, gameData) ||
    isNewPositionSnake(opponentSnakeNewPosition.x, opponentSnakeNewPosition.y, gameData);
}
