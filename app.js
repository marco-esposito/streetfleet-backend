'use strict';

require('dotenv').config();

const Koa = require('koa');
const app = new Koa();
const http = require('http');
const SocketIO = require('socket.io');



const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const jwt = require('jsonwebtoken');
const server = http.createServer(app.callback());
const io = SocketIO(server);


const config = require('./config');
const router = require('./router');
const Company = require('./models/company');

// requiring the db like this is executing the code right here.
require('./db');

/**
 * Middleware
 */

let clients;

io.on('connection',(client) => {
  clients = client;
});

app.use(cors());
app.use(logger());
app.use(bodyParser());

app.use(async (ctx, next) => {
  let token = ctx.headers['authorization'];
  if (!token || token.split(' ')[0] === 'Basic') return await next();
  token = token.split(' ').pop();
  let decoded;
  try {
    decoded = jwt.verify(token, "$secretword");
  } catch (e) {
    return await next();
  }
  ctx.company = await Company.findOne({username: decoded.username});
  await next();
});

app.use(async (ctx,next) => {
  clients.on('subscribeToTimer', () => {
    console.log('client');
      clients.emit('timer', {lat:ctx.request.body.latitude,long:ctx.request.body.longitude});
    });
  await next();
})

/**
 * Routes
 */
app.use(router.routes());
app.use(router.allowedMethods());


server.listen(config.port).on('error', err => {
  console.error(err);
});


console.log(`Server now listening on: ${config.port}`)