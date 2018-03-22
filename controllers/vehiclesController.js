'use strict';
const Company = require('../models/company');
const Location = require('../models/location');

const addOrUpdate = ctx => {
	if (!(ctx.request.body.model &&
					ctx.params.license_number &&
					ctx.request.body.mac_address &&
					ctx.request.body.type &&
					ctx.request.body.year &&
					ctx.request.body.make)) {
		ctx.status = 400;
		ctx.body ='Incomplete request';
		return;
	}
	const matchingVehicle = ctx.company.fleet.filter( vehicle => {
		return (vehicle.license_number===ctx.params.license_number)
	});

	if (matchingVehicle.length > 0) {

		Company.findOneAndUpdate({'company_name': ctx.company.company_name, 'fleet._id': matchingVehicle[0]._id }, {
		'fleet.$.mac_address': ctx.request.body.mac_address, 'fleet.$.model': ctx.request.body.model,
		'fleet.$.license_number': ctx.params.license_number, 'fleet.$.vType': ctx.request.body.type, 'fleet.$.make': ctx.request.body.make, 'fleet.$.year': ctx.request.body.year }, (err, vehicleDocument) => {
			if (err) throw Error;
		});
		ctx.status = 204;
	}

	// add the matchingVehicle if no vehicle with that license number is found
	else {

		ctx.company.fleet.push(
			{
				model: ctx.request.body.model,
				license_number: ctx.params.license_number,
				vType: ctx.request.body.type,
				make: ctx.request.body.make,
				year: ctx.request.body.year,
				mac_address: ctx.request.body.mac_address,
				total_driving_time: 0,
				total_miles_driven: 0
			}
		);
		ctx.company.save(err => {
			if (err) return next(err)
		});
		ctx.status = 201;
		ctx.body = {
			license_number: ctx.params.license_number,
			model: ctx.request.body.model,
			type: ctx.request.body.type,
			make: ctx.request.body.make,
			year: ctx.request.body.year,
			mac_address: ctx.request.body.mac_address,
			total_driving_time: 0,
			total_miles_driven: 0
		};

	}


};

const getVehicle = ctx => {
  const vehicle = ctx.company.fleet.filter(vehicle => vehicle.license_number === ctx.params.license_number);
  if (vehicle.length) {
    ctx.status = 200;
    ctx.body = vehicle[0];
  } else {
    ctx.status = 404;
    ctx.body = 'Vehicle not found'
  }
};

const deleteVehicle = ctx => {
  const removeIndex = ctx.company.fleet.map(vehicle => vehicle.license_number).indexOf(ctx.params.license_number);
  if (removeIndex !== -1) {
    ctx.company.fleet.splice(removeIndex, 1);
    ctx.company.save(err => {
			if (err) return next(err)
		});
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

const postLocation = async ctx => {
	const userData = ctx.request.body;
	if (!userData.mac_address || !userData.time || !userData.latitude || !userData.longitude) {
		ctx.status = 400;
		ctx.body = 'Incomplete body';
		return;
	}
	const location = {
		mac_address: userData.mac_address,
		time: userData.time,
		latitude: userData.latitude,
		longitude: userData.longitude
	}
	try {
		const response = await Location.create(location);
		ctx.status = 201;
		ctx.body = response;
	} catch (e) {
		console.error(e);
	}
};

module.exports = { addOrUpdate, getVehicle, deleteVehicle, getFleet, postLocation };
