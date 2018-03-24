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
    ctx.body = {
      errors: [
        'Unauthorized'
      ]
    };
    return;
  }
  await next();
};

router
  .get('/fleet', authorize, vehicle.getFleet)
  .post('/vehicle', authorize, vehicle.addVehicle)
  .get('/vehicle/:vehicle_id', authorize, vehicle.getVehicle)
  .put('/vehicle/:vehicle_id', authorize, vehicle.updateVehicle)
  .delete('/vehicle/:vehicle_id', authorize, vehicle.deleteVehicle)
  .get('/trips/:mac_address', authorize, vehicle.getTripLogs)

  //postLocation has been replaced by Streetfleet MQ
  // .post('/vehicle/location', vehicle.postLocation)

  .post('/company/sign-up', company.signUp)
  .get('/company/sign-in', company.signIn)


  .get('/*', ctx => {
    ctx.body = {
      errors:[
        `The route doesn't exist`
      ]
    };
    ctx.status = 404;
  });

module.exports = router;
