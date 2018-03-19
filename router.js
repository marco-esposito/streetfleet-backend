'use strict';

const Router = require('koa-router');
const router = new Router();


router.get('/testroute', (ctx, next) => {
  ctx.body = `<p> Blah to test response </p>`;
  ctx.status = 200;
});


router.get('/*', (ctx, next) => {
  ctx.body = `<h1>Sorry the page does not exist</h1>`
  ctx.status = 404
});

module.exports = router;
