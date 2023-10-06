const mongoose = require('mongoose');
const env = require('./environment')
// mongoose.connect('mongodb://0.0.0.0:27017/codeial_development');
mongoose.connect(`mongodb://0.0.0.0:27017/${env.db}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;
