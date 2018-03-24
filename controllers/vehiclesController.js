'use strict';
const Company = require('../models/company');
const Location = require('../models/location');

const updateVehicle = ctx => {
	const userData = ctx.request.body;
	const incompleteBody = !(userData.model && userData.license_number && userData.mac_address && userData.vType && userData.year && userData.make);
	if (incompleteBody) {
		ctx.status = 400;
		ctx.body ='Incomplete request';
		return;
	}

	const matchingVehicles = ctx.company.fleet.filter( vehicle => {
		return (vehicle._id.toString() === ctx.params.vehicle_id)
	});
	if (matchingVehicles.length > 0) {

    //METHOD WITH findOneAndUpdate:
		// Company.findOneAndUpdate({'company_name': ctx.company.company_name, 'fleet._id': matchingVehicles[0]._id }, {
		// 'fleet.$.mac_address': userData.mac_address, 'fleet.$.model': userData.model,
		// 'fleet.$.license_number': userData.license_number, 'fleet.$.vType': userData.vType, 'fleet.$.make': userData.make, 'fleet.$.year': userData.year }, (err, vehicleDocument) => {
		// 	if (err) throw Error;
		// });

		//METHOD WITH MODEL.SAVE():
		const updatedVehicle = {
			mac_address: userData.mac_address,
			model: userData.model,
			license_number: userData.license_number,
			vType: userData.vType,
			make: userData.make,
			year: userData.year
		}
		for (let key in updatedVehicle) matchingVehicles[0][key] = updatedVehicle[key];
		ctx.company.save();
		ctx.status = 204;
		ctx.body = {
			errors: [
				'The vehicle has been deleted'
			]
		}
	}	else {
    ctx.status = 404;
		ctx.body = {
			errors: [
				'Vehicle not found'
			]
		};
	}
};

const addVehicle = async ctx => {
	const userData = ctx.request.body;
	const incompleteBody = !(userData.model && userData.license_number && userData.mac_address && userData.vType && userData.year && userData.make);
	if (incompleteBody) {
		ctx.status = 400;
		ctx.body = {
			errors: [
				'Incomplete request'
			]
		};
		return;
	}

	ctx.company.fleet.push(
		{
			model: userData.model,
			license_number: userData.license_number,
			vType: userData.vType,
			make: userData.make,
			year: userData.year,
			mac_address: userData.mac_address,
			total_driving_time: 0,
			total_miles_driven: 0
		}
	);
	await ctx.company.save((err, res) => {
		if (err) return next(err);
	});
	ctx.status = 201;
	ctx.body = ctx.company.fleet[ctx.company.fleet.length-1];
}

const getVehicle = ctx => {
  const vehicles = ctx.company.fleet.filter(vehicle =>
		vehicle._id.toString() === ctx.params.vehicle_id);
  if (vehicles.length) {
    ctx.status = 200;
    ctx.body = vehicles[0];
  } else {
    ctx.status = 404;
    ctx.body = {
			errors: [
				'Vehicle not found'
			]
		};
  };
};

const deleteVehicle = ctx => {
  const removeIndex = ctx.company.fleet.map(vehicle => vehicle._id.toString()).indexOf(ctx.params.vehicle_id);
  if (removeIndex !== -1) {
    ctx.company.fleet.splice(removeIndex, 1);
    ctx.company.save(err => {
			if (err) return next(err)
		});
    ctx.status = 204;
		ctx.body = {
			message: 'The vehicle has been deleted'
		}
  } else {
    ctx.status = 404;
    ctx.body = {
			errors: [
				'Vehicle not found'
			]
		};
  };
};

const getFleet = ctx => {
  ctx.status = 200;
  ctx.body = ctx.company.fleet;
};

const postLocation = async ctx => {
	const userData = ctx.request.body;
	if (!userData.mac_address || !userData.time || !userData.latitude || !userData.longitude) {
		ctx.status = 400;
		ctx.body = {
			errors: [
				'Incomplete body'
			]
		};
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
	} catch (error) {
		console.error(error);
		ctx.status = 500;
		ctx.body = error.response;
	}
};

module.exports = { updateVehicle, getVehicle, deleteVehicle, getFleet, postLocation, addVehicle };
