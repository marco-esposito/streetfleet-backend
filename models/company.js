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
			vType: String,
			make: String,
			model: String,
			year: Number,
			license_number: String,
			mac_address: String,
			total_driving_time: Number,
			total_km_driven: Number,
		}
	]
});

module.exports = mongoose.model('Company', CompanySchema, 'companies');
