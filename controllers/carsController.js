'use strict';
const Company = require('../models/company');
const Location = require('../models/location');

//TODO: add trip schema for getting trip logs. We will generate this from 'journey' schema. Will have to be mocked for MVP

const addOrUpdate = ctx => {
	console.log('ctx.company: ', ctx.company);
	console.log('ctx.params: ', ctx.params);
	const carOne = ctx.company.fleet.filter( car => {
		return (car.license_number===ctx.params.license_number)
	});
	console.log('carOne: ', carOne);

	if (carOne.length < 0) {
				carOne.mac_address = ctx.req.body.mac_address || carOne.mac_address;
				carOne.carOne_model = ctx.req.body.carOne_model || carOne.carOne_model;
				carOne.license_number = ctx.req.body.carOne.license_number || carOne.CarOne
	}
	// add the carOne if no car with that license number is found
	else if ( ctx.request.body.model &&
	 				ctx.params.license_number &&
					ctx.request.body.mac_address ){
		ctx.company.fleet.push(
			{
				car_model: ctx.request.body.model,
				license_number: ctx.params.license_number,
				mac_address: ctx.request.body.mac_address,
				total_driving_time: 0,
				total_miles_driven: 0,
			}
		);
		ctx.company.save();
	}
};

const getCar = ctx => {
  const car = ctx.company.fleet.filter(car => car.license_number === ctx.params.license_number);
  if (car.length) {
    ctx.status = 200;
    ctx.body = car;
  } else {
    ctx.status = 404;
    ctx.body = 'Car not found'
  }
};

const deleteCar = ctx => {
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

const getFleet = ctx => {
  ctx.status = 200;
  ctx.body = ctx.company.fleet;
};

module.exports = { addOrUpdate, getCar, deleteCar, getFleet };
