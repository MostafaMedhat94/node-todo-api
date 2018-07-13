const mongoose = require('mongoose');

// const port = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';

mongoose.Promise = global.Promise;
mongoose.connect((process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'), {useMongoClient: true});

module.exports.mongoose = mongoose;