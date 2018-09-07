var {User} = require('./../models/user')

var authenticate = (req, res, next) => {
  //actual route won't run until next called in middleware
  var token = req.header('x-auth'); // get header -

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();// function will stop and will run error case
    }

    //modify request object
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
}

module.exports = {
  authenticate
}
