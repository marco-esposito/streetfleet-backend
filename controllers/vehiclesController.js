'use strict';
const fetch = require('node-fetch');

const Company = require('../models/company');
// const Location = require('../models/location');
const Trip = require('../models/trip');

const updateVehicle = async ctx => {
	const userData = ctx.request.body;
	const incompleteBody = !(userData.model && userData.license_number && userData.mac_address && userData.vType && userData.year && userData.make);
	if (incompleteBody) {
		ctx.status = 400;
		ctx.body = {
			errors: [
				'Incomplete body'
			]
		};
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
		try {
			await ctx.company.save();
			ctx.status = 204;
			ctx.body = {
				message: 'The vehicle has been updated'
			};
		} catch (e) {
			console.error(e);
			ctx.status = 500;
			ctx.body = e.message;
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
				'Incomplete body'
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
	try {
		await ctx.company.save();
		ctx.status = 201;
		ctx.body = ctx.company.fleet[ctx.company.fleet.length-1];
	} catch (e) {
		console.error(e);
		ctx.status = 500;
		ctx.body = e.message;
	}
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

const deleteVehicle = async ctx => {
  const removeIndex = ctx.company.fleet.map(vehicle => vehicle._id.toString()).indexOf(ctx.params.vehicle_id);
  if (removeIndex !== -1) {
    ctx.company.fleet.splice(removeIndex, 1);
		try {
			await ctx.company.save();
		} catch (e) {
			console.error(e);
			ctx.status = 500;
			ctx.body = e.message;
		};
		ctx.status = 204;
		ctx.body = {
			message: 'The vehicle has been deleted'
		};
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
		if !(userData.mac_address && userData.time && userData.latitude && userData.longitude) {
			ctx.status = 400;
			ctx.body = {
				errors: [
					'Incomplete body'
				]
			};
			return;
		}

	try {
		const response = await fetch(process.env.STREETFLEET_MQ_URL, {
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(ctx.request.body)
		});
		ctx.status = 201;
		ctx.body = {
			message: 'Created'
		}
		
	} catch (e) {
		console.error(e);
		ctx.status = 500;
		ctx.body = {
			errors: [
				'Something was wrong on the StreetFleetMQ'
			]
		}
	}

}

const postLocation = async ctx => {
	try {
		const response = await fetch(process.env.STREETFLEET_MQ_URL, {
			headers: {
				'content-type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(ctx.request.body)
		});
		ctx.status = 201;
		ctx.body = {
			message: 'Created'
		}
	} catch (e) {
		console.error(e);
		ctx.status = 500;
		ctx.body = {
			errors: [
				'Something was wrong on the StreetFleetMQ'
			]
		}
	}

}

const getTripLogs = async ctx => {
	try {
		const response = await Trip.find({mac_address: ctx.params.mac_address});
		ctx.status = 200;
		ctx.body = response;
	} catch (e) {
		console.error(e);
		ctx.status = 500;
		ctx.body = e.message;
	};
}

module.exports = { updateVehicle, getVehicle, deleteVehicle, getFleet, postLocation, addVehicle, getTripLogs };
