const express = require('express');

const app = express();
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000/',
  credentials: true,
}));
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


const sockets = [];

io.on('connection', (socket) => {
  socket.emit('connected',"Hey");
  socket.on("joinRoom", (data)=>{
    console.log(data);
    socket.join(data);
    io.to(data).emit("Joined room", io.sockets.adapter.rooms[data]);
  });
});


server.listen('8000', () => console.log('Server listening on port 8000')); // eslint-disable-line
