'use strict';

require('dotenv').config();

const Koa = require('koa');
const app = new Koa();

const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const jwt = require('jsonwebtoken');

const config = require('./config');
const router = require('./router');
const Company = require('./models/company');

// requiring the db like this is executing the code right here.
require('./db');

/**
 * Middleware
 */
app.use(cors());
app.use(logger());
app.use(bodyParser());

//handling errors ultimately
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = undefined;
    switch (ctx.status) {
    case 401:
      ctx.app.emit('error', err, this);
      break;
    default:
      if (err.message) {
        ctx.body = {errors:[err.message]};
      }
      ctx.app.emit('error', err, this);
    }
  }
});

//middleware for authentication
// From this middleware on, ctx is appended with company (the company information). That is available to all the routes now.
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


app.listen(config.port).on('error', err => {
  console.error(err);
});

console.log(`Server now listening on: ${config.port}`)
