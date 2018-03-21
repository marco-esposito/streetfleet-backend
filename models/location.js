'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
	mac_address: String,
	time: Date,
	latitude: Number,
	longitude: Number
});

module.exports = mongoose.model('Location', LocationSchema);
