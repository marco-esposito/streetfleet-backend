'use strict';
const Company = require('../models/company');
const Location = require('../models/location');

const addOrUpdate = ctx => {
	console.log('CTX.COMPANY: ', ctx.company);
	console.log('CTX.PARAMS: ', ctx.params);
	const matchingVehicle = ctx.company.fleet.filter( vehicle => {
		console.log('vehicle: ', vehicle);
		return (vehicle.license_number===ctx.params.license_number)
	});

	console.log('MATCHINGVEHICLE: ', matchingVehicle);
	if (matchingVehicle.length > 0) {
		console.log('we entered the if!!!');
		// NOTE: 'useFindAndModify': true by default. Set to false to make findOneAndUpdate() and findOneAndRemove() use native findOneAndUpdate() rather than findAndModify().
		// upsert: bool - creates the object if it doesn't exist. defaults to false.
		console.log('MATCHINGVEHICLE (INSIDE): ', matchingVehicle[0]);
		Company.findOneAndUpdate({'company_name': ctx.company.company_name, 'fleet._id': matchingVehicle[0]._id }, {
		'fleet.$.mac_address': ctx.request.body.mac_address, 'fleet.$.model': ctx.request.body.model,
		'fleet.$.license_number': ctx.params.license_number, 'fleet.$.vType': ctx.request.body.type, 'fleet.$.make': ctx.request.body.make, 'fleet.$.year': ctx.request.body.year }, (err, vehicleDocument) => {
			if (err) throw Error;
			// can do something with vehicleDocument her if you wanted.
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
		// could also have done soemthign like this: var newdoc = parent.children.create({ name: 'Aaron' });
		ctx.company.fleet.push(
			{
				model: ctx.request.body.model,
				license_number: ctx.params.license_number,
				mac_address: ctx.request.body.mac_address,
				year: ctx.request.body.year,
				model: ctx.request.body.model,
				vType: ctx.request.body.type,
				make: ctx.request.body.make
						}
		);
		ctx.company.save(err => {
			if (err) return next(err)
		});
	}
	ctx.status = 200;
	ctx.body = {
		make: ctx.request.body.make,
		license_number: ctx.params.license_number,
		mac_address: ctx.request.body.mac_address,
		year: ctx.request.body.year,
		model: ctx.request.body.model,
		type: ctx.request.body.type,
	}
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
