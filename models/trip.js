'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TripSchema = new Schema({
  mac_address: String,
  start_time: Date,
  end_time: Date,
  locations: [{
    time: Date,
    latitude: Number,
    longitude: Number,
  }],
  distance: Number,
});

module.exports = mongoose.model('Trip', TripSchema);
