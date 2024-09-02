const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const PocketBase = require('pocketbase/cjs')
const pb = new PocketBase('https://connormerk.pockethost.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));
app.use(express.static('modules'));
app.use(express.static('node-modules'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Serve the index.html file directly
});

app.get('/modules/fingerprint.js', (req, res) => {
  res.sendFile(__dirname + '/modules/fingerprint.js'); // Serve the index.html file directly
});

io.on('connection', (socket) => {
    socket.on('chat', async (msg) => {
      console.log('message: ' + msg.text);
      io.emit('chat', msg);
      const data = {
        "username": msg.name,
        "content": msg.text,
        "fingerprint": msg.visitorId
    };
    console.log(msg.visitorId)
    
    const record = await pb.collection('messages').create(data);
    });
  });

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});