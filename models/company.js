'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanySchema = new Schema({
	company_name: String,
	email: String,
	username: String,
	password: String,
	fleet:[
		{
			car_id: String,
			car_model: String,
			license_number: String,
			mac_address: String,
			total_driving_time: Number,
			total_miles_driven: Number,
		}
	]
});

module.exports = mongoose.model('Company', CompanySchema, 'Companies');
