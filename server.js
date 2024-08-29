const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Serve the index.html file directly
});

io.on('connection', (socket) => {
    socket.on('chat', (msg) => {
      console.log('message: ' + msg.text);
      io.emit('chat', msg);
    });
  });

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});