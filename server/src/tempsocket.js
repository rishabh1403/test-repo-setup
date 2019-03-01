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

  io.on('connection', (socket) => {
    socket.emit('connected', "Hey");
    socket.on("joinRoom", (data) => {
      console.log(data);
      socket.join(data);

      console.log(io.sockets.adapter.rooms[data])
      if (io.sockets.adapter.rooms[data].length === 1) {
        initGame(data);
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
      if (socket.id === gameData[data].snake.id) {
        gameData[data].snake.direction = direction;
      } else {
        gameData[data].snake2.direction = direction;
      }

    })

    socket.on('updateGame', () => {
      let data = Object.keys(socket.rooms)[1];
      let { nx, ny } = getNewSnakePosition(gameData[data].snake);
      let { nx: nx1, ny: ny1 } = getNewSnakePosition(gameData[data].snake2);
      if (isGameOver(nx, ny, nx1, ny1, gameData[data])) {
        gameData[data].initDone = 0;
        return socket.emit("gameOver");
      }

      let tail = null, tail1 = null;

      if (isNewPositionFood(nx, ny, gameData[data])) {
        gameData[data].score++;
        tail = { x: nx, y: ny }
        // setting food

        addNewFood(data);

      } else {
        tail = gameData[data].snake.remove();
        gameData[data].grid.set(EMPTY, tail.x, tail.y);
        tail.x = nx;
        tail.y = ny;
      }

      if (isNewPositionFood(nx1, ny1, gameData[data])) {
        gameData[data].score++;
        tail1 = { x: nx1, y: ny1 }
        // setting food

        
        addNewFood(data);


      } else {
        tail1 = gameData[data].snake2.remove();
        gameData[data].grid.set(EMPTY, tail1.x, tail1.y);

        tail1.x = nx1;
        tail1.y = ny1;
      }

      addTail(data, tail, tail1);

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