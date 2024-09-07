import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;
import dotenv from 'dotenv';
import PocketBase from 'pocketbase';
import winston from 'winston';
const pb = new PocketBase('https://connormerk.pockethost.io');

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const config = {
  authRequired: true,
  auth0Logout: true,
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

app.get("/logs", (req, res) => {
  res.sendFile("combined.log")
})

app.get('/api/ray-id', (req, res) => {
  const rayId = crypto.randomUUID
  res.send({rayId})
})

app.get('/modules/fingerprint.js', (req, res) => {
  res.sendFile(__dirname + '/modules/fingerprint.js'); // Serve the index.html file directly
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.all('*', (req, res) => {
  res.status(404).sendFile('/public/404/index.html', {
    root: '/public/404'
  })
    .then(() => {
      // Send additional files here using res.sendFile or res.send
      res.sendFile('/public/404/style.css', { root: __dirname + '/public/404' });
      // Add more files as needed
    })
    .catch(err => {
      console.error('Error sending 404 files:', err);
    });
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
    logger.info(msg)

    try {
      const record = await pb.collection('messages').create(data);
    } catch (error) {
      logger.error(error)
    }
    });
  });

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});