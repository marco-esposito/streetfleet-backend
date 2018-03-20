'use strict';

require('dotenv').config();

const Koa = require('koa');
const app = new Koa();

const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');

const config = require('./config');
const router = require('./router');

// requiring the db like this is executing the code right here.
require('./db');

/**
 * Middlewhere
 */
app.use(cors());
app.use(logger());
app.use(bodyParser());

/**
 * Routes
 */
app.use(router.routes());
app.use(router.allowedMethods());


app.listen(config.port).on('error', err => {
  console.error(err);
});

console.log(`Server now listening on: ${config.port}`)
