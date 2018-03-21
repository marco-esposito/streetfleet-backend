'use strict';
const Company = require('../models/company');
const Location = require('../models/location');


//TODO: add trip schema for getting trip logs. We will generate this from 'journey' schema. Will have to be mocked for MVP


exports.get = ctx => {
  const car = ctx.company.fleet.filter(car => car.license_number === ctx.params.license_number);
  if (car.length) {
    ctx.status = 200;
    ctx.body = car;
  } else {
    ctx.status = 404;
    ctx.body = 'Car not found'
  }
};

exports.delete = ctx => {
  const removeIndex = ctx.company.fleet.map(car => car.license_number).indexOf(ctx.params.license_number);
  if (removeIndex !== -1) {
    ctx.company.fleet.splice(removeIndex, 1);
    ctx.company.save();
    ctx.status = 204;
  } else {
    ctx.status = 404;
    ctx.body = 'Car not found'
  }
};
