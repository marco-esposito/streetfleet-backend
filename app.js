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
 * Middlewhere
 */
app.use(cors());
app.use(logger());
app.use(bodyParser());

app.use(async (ctx, next) => {
  let token = ctx.headers['authorization'];
  if (!token) return await next();
  token = token.split(' ').pop();
  try {
    const decoded = jwt.verify(token, "$ecret%&wor£d");
  } catch (e) {
    return await(next);
  }
  ctx.user = await Company.findOne({username: decoded.username});
  return await next();
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
