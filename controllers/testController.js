'use strict';
const Company = require('../models/company');
const Location = require('../models/location');


//TODO: add trip schema for getting trip logs. We will generate this from 'journey' schema. Will have to be mocked for MVP


exports.testAdd = ctx => {
		const data = {
			company_name: 'DEF',
		  email: 'bingbong@pp.com',
			username: 'gonkit',
			password: 'g4hj32gj',
			fleet: [
				{
					car_id: '12344234',
					car_model: 'model-T',
					license_number: '3g329423',
					MAC_address: 'a5:b7:cc:98:45',
					total_driving_time: 200,
					total_miles_driven: 400
				}
			]
		};

		Company.create(data);
}
