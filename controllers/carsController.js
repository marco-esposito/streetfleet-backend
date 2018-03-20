'use strict';
const Company = require('../models/company');
const Location = require('../models/location');

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

//TODO: add trip schema for getting trip logs. We will generate this from 'journey' schema. Will have to be mocked for MVP
module.exports = { addOrUpdate };
