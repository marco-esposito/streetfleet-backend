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
let lat = 30.34534534;
let long = 2.175017;
setInterval(function(){
  lat = lat + 0.001
  long = long + 0.001
},1000);
io.on('connection',(client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client');
    setInterval(() => {
      client.emit('timer', {lat,long});
    }, interval);
  });
  io.socket.emit('mobile',client);
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

/**
 * Routes
 */
app.use(router.routes());
app.use(router.allowedMethods());


server.listen(config.port).on('error', err => {
  console.error(err);
});


console.log(`Server now listening on: ${config.port}`)
