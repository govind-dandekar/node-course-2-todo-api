var env = process.env.NODE_ENV || 'development'; //only set on Heroku; maching has 2 dozen variable


if (env === 'development' || env === 'test'){
  //load in seperate JSON file -- this file will not be part of git repo
  //need to set process.env
  var config = require('./config.json') //automatically parses into JS
  var envConfig = config[env];

  //loop over env type -- takes keys and returns as array
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
