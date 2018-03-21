'use strict';
const Company = require('../models/company');
const Location = require('../models/location');

const addOrUpdate = ctx => {
	const matchingVehicle = ctx.company.fleet.filter( vehicle => {
		return (vehicle.license_number===ctx.params.license_number)
	});

	// console.log('MATCHINGVEHICLE: ', matchingVehicle);
	if (matchingVehicle.length > 0) {
		// console.log('we entered the if!!!');
		// console.log('MATCHINGVEHICLE (INSIDE): ', matchingVehicle[0]);

		Company.findOneAndUpdate({'company_name': ctx.company.company_name, 'fleet._id': matchingVehicle[0]._id }, {
		'fleet.$.mac_address': ctx.request.body.mac_address, 'fleet.$.model': ctx.request.body.model,
		'fleet.$.license_number': ctx.params.license_number, 'fleet.$.vType': ctx.request.body.type, 'fleet.$.make': ctx.request.body.make, 'fleet.$.year': ctx.request.body.year }, (err, vehicleDocument) => {
			if (err) throw Error;
		})
	}

	// add the matchingVehicle if no vehicle with that license number is found
	else if (ctx.request.body.model &&
					ctx.params.license_number &&
					ctx.request.body.mac_address &&
					ctx.request.body.type &&
					ctx.request.body.year &&
					ctx.request.body.make){
		console.log('we entered the else if!');
		console.log('ctx.request.body: ', ctx.request.body);

		ctx.company.fleet.push(
			{
				model: ctx.request.body.model,
				license_number: ctx.params.license_number,
				vType: ctx.request.body.type,
				make: ctx.request.body.make
				year: ctx.request.body.year,
				mac_address: ctx.request.body.mac_address
			}
		);
		ctx.company.save(err => {
			if (err) return next(err)
		});
	}

	ctx.status = 200;
	ctx.body = {
		license_number: ctx.params.license_number,
		model: ctx.request.body.model,
		type: ctx.request.body.type,
		make: ctx.request.body.make,
		year: ctx.request.body.year
	};
};

const getVehicle = ctx => {
  const vehicle = ctx.company.fleet.filter(vehicle => vehicle.license_number === ctx.params.license_number);
  if (vehicle.length) {
    ctx.status = 200;
    ctx.body = vehicle;
  } else {
    ctx.status = 404;
    ctx.body = 'Vehicle not found'
  }
};

const deleteVehicle = ctx => {
  const removeIndex = ctx.company.fleet.map(vehicle => vehicle.license_number).indexOf(ctx.params.license_number);
  if (removeIndex !== -1) {
    ctx.company.fleet.splice(removeIndex, 1);
    ctx.company.save();
    ctx.status = 204;
  } else {
    ctx.status = 404;
    ctx.body = 'Vehicle not found'
  }
};

const getFleet = ctx => {
  ctx.status = 200;
  ctx.body = ctx.company.fleet;
};

module.exports = { addOrUpdate, getVehicle, deleteVehicle, getFleet };
