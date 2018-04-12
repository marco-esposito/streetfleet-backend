'use strict';

require('dotenv').config();

const Koa = require('koa');
const app = new Koa();

const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');

const config = require('./config');
const router = require('./router');


const errorHandler = require('./errorMiddleware');
const authHandler = require('./authMiddleware');
// requiring the db like this is executing the code right here.
require('./db');

/**
 * Middleware
 */
app.use(cors());
app.use(logger());
app.use(bodyParser());

//handling errors ultimately
// TODO: Clarify usecase 
app.use(errorHandler);

//middleware for authentication
// From this middleware on, ctx is appended with company (the company information). That is available to all the routes now.
app.use(authHandler);

/**
 * Routes
 */
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port).on('error', err => {
  console.error(err);
});

console.log(`Server now listening on: ${config.port}`);
