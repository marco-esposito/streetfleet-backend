'use strict';
const vehicle = require('./controllers/vehiclesController');
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

  .get('/fleet', authorize, vehicle.getFleet)
  .put('/fleet/vehicle/:license_number', authorize, vehicle.addOrUpdate)
  .get('/fleet/vehicle/:license_number', authorize, vehicle.getVehicle)
  .delete('/fleet/vehicle/:license_number', authorize, vehicle.deleteVehicle)

  //NOTE: vehicle.getTripLogs will have to be faked for MVP
  // .get('/fleet/vehicle/trips/:license_number', authorize, vehicle.getTripLogs)
  .post('/fleet/vehicle/location', vehicle.postLocation)

  .post('/company/sign-up', company.signUp)
  .get('/company/sign-in', company.signIn)


  .get('/*', ctx => {
    ctx.body = `The route doesn't exist`;
    ctx.status = 404;
  });

module.exports = router;
