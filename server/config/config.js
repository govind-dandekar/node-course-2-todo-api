var env = process.env.NODE_ENV || 'development'; //only set on Heroku; maching has 2 dozen variable

if (env === 'development') {
  // PORT and NODE_ENV and UserID
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest' //added new database for mocha
}
