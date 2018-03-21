'use strict';
const car = require('./controllers/carsController');
const test = require('./controllers/testController');
const company = require('./controllers/companiesController');

const Router = require('koa-router');
const router = new Router({
    prefix: '/api/v1'
});

const authorize = async (ctx, next) => {
  if (!ctx.company) {
    ctx.status = 401;
    ctx.body = 'Unauthorized';
    return;
  }
  await next();
};

router
  // .get('/testroute', test.testAdd)
  // .get('/testauthorize', authorize, test.authorize)

  .get('/fleet', authorize, car.getFleet)
  .put('/fleet/car/:license_number', authorize, car.addOrUpdate)
  .get('/fleet/car/:license_number', authorize, car.get)
  .delete('/fleet/car/:license_number', authorize, car.delete)

  //NOTE: car.getTripLogs will have to be faked for MVP
  // .get('/fleet/car/trips/:license_number', authorize, car.getTripLogs)
  // .post('/fleet/car/location', car.postLocation
  //
  .post('/company/sign-up', company.signUp)
  .get('/company/sign-in', company.signIn)


  .get('/*', ctx => {
    ctx.body = `The route doesn't exist`
    ctx.status = 404
  });

module.exports = router;