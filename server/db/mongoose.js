var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //set up to use promises
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'); //connected to DB

module.exports = {
  mongoose: mongoose
}
