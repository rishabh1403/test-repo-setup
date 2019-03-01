import socketio from 'socket.io';
import { gameConstants } from '../utils/contants';
import Grid from './Grid';
import Snake from './Snake';

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
} = gameConstants;
const gameData = {};

// helper functions
function getUserGameRoom(socket) {
  return Object.keys(socket.rooms)[1];
}

function initGame(room) {
  gameData[room] = {};
  gameData[room].snake = new Snake();
  gameData[room].opponentSnake = new Snake();
  gameData[room].initDone = 0;
  gameData[room].grid = new Grid();
}

function getEmptyCells(room) {

  const empty = [];
  for (let x = 0; x < gameData[room].grid.width; x += 1) {
    for (let y = 0; y < gameData[room].grid.height; y += 1) {
      if (gameData[room].grid.get(x, y) === EMPTY) {
        empty.push({ x, y });
      }
    }
  }
  return empty;
}

function addNewFood(room) {

  const empty = getEmptyCells(room);
  const randpos = empty[Math.floor(Math.random() * empty.length)];
  gameData[room].grid.set(FOOD, randpos.x, randpos.y);
}

function putSnakes(socketIDs, room) {
  gameData[room].grid.init(EMPTY, COLS, ROWS);

  let sp = { x: Math.floor(COLS / 2), y: ROWS - 1 }
  gameData[room].snake.init(UP, sp.x, sp.y, socketIDs[0]);
  gameData[room].grid.set(SNAKE, sp.x, sp.y);

  sp = { x: COLS - 1, y: Math.floor(ROWS / 2) }
  gameData[room].opponentSnake.init(LEFT, sp.x, sp.y, socketIDs[1]);
  gameData[room].grid.set(SNAKE, sp.x, sp.y);
}
function isNewPositionFood(snakeNewPositionX, snakeNewPositionY, state) {
  return state.grid.get(snakeNewPositionX, snakeNewPositionY) === FOOD;
}

function getTail(room, snakeNewPosition, snake) {
  let tail = null;
  if (isNewPositionFood(snakeNewPosition.x, snakeNewPosition.y, gameData[room])) {
    gameData[room].score += 1;
    tail = { x: snakeNewPosition.x, y: snakeNewPosition.y }
    addNewFood(room);
  } else {
    tail = gameData[room][snake].remove();
    gameData[room].grid.set(EMPTY, tail.x, tail.y);
    tail = { x: snakeNewPosition.x, y: snakeNewPosition.y }
  }
  return tail;
}

function addTail(room, tail, opponentSnakeTail) {
  gameData[room].grid.set(SNAKE, tail.x, tail.y);
  gameData[room].grid.set(SNAKE, opponentSnakeTail.x, opponentSnakeTail.y);
  gameData[room].snake.insert(tail.x, tail.y);
  gameData[room].opponentSnake.insert(opponentSnakeTail.x, opponentSnakeTail.y);
}


function getNewSnakePosition(snake) {
  let { last: { x }, last: { y } } = snake;
  switch (snake.direction) {
    case LEFT:
      x -= 1;
      break;
    case UP:
      y -= 1;
      break;
    case RIGHT:
      x += 1;
      break;
    case DOWN:
      y += 1;
      break;
    default:
      break;
  }
  return { x, y };
}

function isNewPositionBorder(snakeNewPositionX, snakeNewPositionY, state) {
  return snakeNewPositionX < 0 || snakeNewPositionX > state.grid.width - 1 ||
    snakeNewPositionY < 0 || snakeNewPositionY > state.grid.height - 1;
}

function isNewPositionSnake(snakeNewPositionX, snakeNewPositionY, state) {
  return state.grid.get(snakeNewPositionX, snakeNewPositionY) === SNAKE;
}

function isGameOver(snakeNewPosition, opponentSnakeNewPosition, state) {
  return isNewPositionBorder(snakeNewPosition.x, snakeNewPosition.y, state) ||
    isNewPositionSnake(snakeNewPosition.x, snakeNewPosition.y, state) ||
    isNewPositionBorder(opponentSnakeNewPosition.x, opponentSnakeNewPosition.y, state) ||
    isNewPositionSnake(opponentSnakeNewPosition.x, opponentSnakeNewPosition.y, state);
}


// events
function connectedEvent(socket) {
  socket.emit('connected', "Hey");
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

function initEvent(io, socket) {
  socket.on("init", () => {
    const room = getUserGameRoom(socket);
    gameData[room].score = 0;
    if (io.sockets.adapter.rooms[room].length === 2) {
      const socketIDs = Object.keys(io.sockets.adapter.rooms[room].sockets);
      putSnakes(socketIDs, room);
      addNewFood(room);
    }
    gameData[room].initDone+=1;
    console.log("init fired");
  })
}

function changeDirectionEvent(socket) {

  socket.on('changeDirection', (direction) => {
    const room = getUserGameRoom(socket);
    if (socket.id === gameData[room].snake.id) {
      gameData[room].snake.direction = direction;
    } else {
      gameData[room].opponentSnake.direction = direction;
    }
  })
}

function updateGameEvent(socket) {
  socket.on('updateGame', () => {
    const room = getUserGameRoom(socket);
    const snakeNewPosition = getNewSnakePosition(gameData[room].snake);
    const opponentSnakeNewPosition = getNewSnakePosition(gameData[room].opponentSnake);
    if (isGameOver(snakeNewPosition, opponentSnakeNewPosition, gameData[room])) {
      gameData[room].initDone = 0;
      return socket.emit("gameOver");
    }
    const tail = getTail(room, snakeNewPosition, 'snake')
    const opponentSnakeTail = getTail(room, opponentSnakeNewPosition, 'opponentSnake')

    addTail(room, tail, opponentSnakeTail);

    return socket.emit("draw", gameData[room].grid.grid);
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

function init(server) {
  const io = socketio.listen(server);
  setupEvents(io);
}
export default { init };
