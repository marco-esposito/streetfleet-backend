'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const LocationSchema = new Schema([{
	car_id: String,
	timestamp: Date,
	latitude: Number,
	longtitude: Number
}])

module.exports = mongoose.model('Location', LocationSchema);
