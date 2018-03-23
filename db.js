const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/streetfleet');
mongoose.connect('mongodb://streetfleet:streetfleet@ds121299.mlab.com:21299/streetfleet');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Connected to the DB...');
})

module.exports = mongoose;
