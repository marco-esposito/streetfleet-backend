'use strict';

require('dotenv').config();

const Koa = require('koa');
const app = new Koa();

const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const config = require('./config');
const router = require('./router');

/**
 * Middlewhere
 */
app.use(logger());
app.use(bodyParser());

/**
 * Routes
 */
app.use(router.routes());
// app.use(router.allowedMethods());


/**
 * 404
 */

app.listen(config.port).on('error', err => {
  console.error(err);
});

console.log(`Server now listening on: ${config.port}`)
