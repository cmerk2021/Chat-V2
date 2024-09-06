import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
const pb = new PocketBase('https://connormerk.pockethost.io');

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const config = {
  authRequired: true,
  auth0Logout: false,
  secret: process.env.AUTH_SECRET,
  baseURL: 'https://chat.connormerk.com',
  clientID: 'SgxVwmFqUvYE22C6AwklJF6enI9xxHuA',
  issuerBaseURL: 'https://dev-1xplak4wpjshhzlh.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use(express.static('public'));
app.use(express.static('modules'));
app.use(express.static('node-modules'));

app.get('/', requiresAuth(), (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Serve the index.html file directly
});

app.get('/modules/fingerprint.js', (req, res) => {
  res.sendFile(__dirname + '/modules/fingerprint.js'); // Serve the index.html file directly
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
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