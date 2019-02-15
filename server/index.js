const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


const sockets = [];

io.on('connection', (socket) => {
  sockets.push(socket);
  console.log(`a new client connection ${socket.id}`); //eslint-disable-line
  if (sockets.length === 2) {
    io.emit('ready');
    const socket1 = sockets[0];
    const socket2 = sockets[1];

    socket1.on('keydown', (...args) => {
      socket2.emit('keydown', ...args);
    });

    socket1.on('keyup', (...args) => {
      socket2.emit('keyup', ...args);
    });

    socket2.on('keydown', (...args) => {
      socket1.emit('keydown', ...args);
    });

    socket2.on('keyup', (...args) => {
      socket1.emit('keyup', ...args);
    });
  }
});


app.listen('8000', () => console.log('Server listening on port 8000')); // eslint-disable-line
