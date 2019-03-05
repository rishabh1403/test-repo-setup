import socketio from 'socket.io';
import { gameConstants } from '../utils/contants';
import Grid from './Grid';
import Snake from './Snake';

const {
  ROWS,
  COLS,
  EMPTY,
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
  // const color1 = `#${Math.random().toString(16).slice(2, 8)}`;
  // const color2 = `#${Math.random().toString(16).slice(2, 8)}`;
  let sp = { x: Math.floor(COLS / 2), y: ROWS - 1 }
  gameData[room].snake.init(UP, sp.x, sp.y, socketIDs[0], '#191970');
  gameData[room].grid.set(socketIDs[0], sp.x, sp.y);

  sp = { x: COLS - 1, y: Math.floor(ROWS / 2) }
  gameData[room].opponentSnake.init(LEFT, sp.x, sp.y, socketIDs[1], '#8B4513');
  gameData[room].grid.set(socketIDs[1], sp.x, sp.y);
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

function addTail(io, room, tail, opponentSnakeTail) {
  const socketIDs = Object.keys(io.sockets.adapter.rooms[room].sockets);

  gameData[room].grid.set(socketIDs[0], tail.x, tail.y);
  gameData[room].grid.set(socketIDs[1], opponentSnakeTail.x, opponentSnakeTail.y);
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
  return state.grid.get(snakeNewPositionX, snakeNewPositionY) !== EMPTY &&
    state.grid.get(snakeNewPositionX, snakeNewPositionY) !== FOOD;
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
    gameData[room].initDone += 1;
    console.log("init fired");
  })
}

function shouldChangeDirection(newDirection, oldDirection) {
  return (newDirection === LEFT && oldDirection !== RIGHT) ||
    (newDirection === RIGHT && oldDirection !== LEFT) ||
    (newDirection === UP && oldDirection !== DOWN) ||
    (newDirection === DOWN && oldDirection !== UP)
}
function changeDirectionEvent(socket) {

  socket.on('changeDirection', (direction) => {
    const room = getUserGameRoom(socket);
    if (socket.id === gameData[room].snake.id) {
      if (shouldChangeDirection(direction, gameData[room].snake.direction)) {
        gameData[room].snake.direction = direction;
      }
    } else {
      // eslint-disable-next-line
      if (shouldChangeDirection(direction, gameData[room].opponentSnake.direction)) {
        gameData[room].opponentSnake.direction = direction;
      }
    }
  })
}

function updateGameEvent(io, socket) {
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

    addTail(io, room, tail, opponentSnakeTail);
    const data = {
      grid: gameData[room].grid.grid,
      snakeColors: {
        [gameData[room].snake.id]: gameData[room].snake.color,
        [gameData[room].opponentSnake.id]: gameData[room].opponentSnake.color,
      }
    }
    return io.to(getUserGameRoom(socket)).emit("draw", data);
    // return socket.emit("draw", data);
  })
}

function disconnectingEvent(io, socket) {
  socket.on('disconnecting', () => {
    io.to(getUserGameRoom(socket)).emit("Leave room");
  })
}

function setupEvents(io) {
  io.on('connection', (socket) => {
    connectedEvent(socket);
    joinRoomEvent(io, socket);
    initEvent(io, socket);
    changeDirectionEvent(socket);
    updateGameEvent(io, socket);
    disconnectingEvent(io, socket);
  });
}

function init(server) {
  const io = socketio.listen(server);
  setupEvents(io);
}
export default { init };
