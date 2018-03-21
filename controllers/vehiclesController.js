'use strict';
const Company = require('../models/company');
const Location = require('../models/location');

const addOrUpdate = ctx => {
	console.log('ctx.company: ', ctx.company);
	console.log('ctx.params: ', ctx.params);
	const matchingVehicle = ctx.company.fleet.filter( vehicle => {
		console.log('vehicle: ', vehicle);
		return (vehicle.license_number===ctx.params.license_number)
	});

	console.log('matchingVehicle: ', matchingVehicle);
	if (matchingVehicle.length > 0) {
		// NOTE: 'useFindAndModify': true by default. Set to false to make findOneAndUpdate() and findOneAndRemove() use native findOneAndUpdate() rather than findAndModify().
		// upsert: bool - creates the object if it doesn't exist. defaults to false.

		// console.log('matchingVehicle (inside): ', matchingVehicle);
		// Company.findOneAndUpdate({'company_name': ctx.company, 'fleet._id': matchingVehicle._id }, {'fleet.$.mac_address' = ctx.request.body.mac_address,
		// 'fleet.$.model' = ctx.request.body.model,
		// 'fleet.$.license_number' = ctx.params.license_number }, (err, vehicleDocument) => {
		// 	if (err) throw Error;
		// 	// can do something with vehicleDocument her if you wanted.
		// })
		console.log('matchingVehicle (inside): ', matchingVehicle);
		Company.findOneAndUpdate({'company_name': ctx.company, 'fleet._id': matchingVehicle._id },
		{'fleet.$.mac_address' = ctx.request.body.mac_address}, (err, vehicleDocument) => {
			if (err) throw Error;
			// can do something with vehicleDocument her if you wanted.
		})

			console.log('matchingVehicle (after): ', matchingVehicle);
	}
	// add the matchingVehicle if no vehicle with that license number is found
	else if ( ctx.request.body.model &&
	 				ctx.params.license_number &&
					ctx.request.body.mac_address ){
		// could also have done soemthign like this: var newdoc = parent.children.create({ name: 'Aaron' });
		ctx.company.fleet.push(
			{
				model: ctx.request.body.model,
				license_number: ctx.params.license_number,
				mac_address: ctx.request.body.mac_address,
				year: ctx.request.body.year,
				model: ctx.request.body.model
						}
		);
		ctx.company.save(err => {
			if (err) return next(err)
		});
		ctx.status = 200;
		ctx.body = {
			make: ctx.request.body.make,
			license_number: ctx.params.license_number,
			mac_address: ctx.request.body.mac_address,
			year: ctx.request.body.year,
			model: ctx.request.body.model
		}

	}
};

//TODO: add trip schema for getting trip logs. We will generate this from 'journey' schema. Will have to be mocked for MVP
module.exports = { addOrUpdate };


// ctx.company.save( err => {
// 	if (err) return next(err)
// });
