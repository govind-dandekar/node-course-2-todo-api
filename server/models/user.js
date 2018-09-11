const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true, // verifies that prop is not the same an any other accts
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
  }
)

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject(); //toObject() takes mongoose var and converts it into regular Object

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function (){
  var user = this; //gives access to user.f(x) that was called with

  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString(); //returns String token
  //data generated; update userStrong Tokens array
  user.tokens = user.tokens.concat([{access, token}]) //update user model
  return user.save().then(() => {
    return token;
  }) //saves
};

UserSchema.methods.removeToken = function (token) {
  var user = this;
  
  //console.log(token);
  return user.update({
    $pull: {
      tokens: {token}
    }
  })
}


//.statics -> everythig turns intoa model method
UserSchema.statics.findByToken = function(token) {
  //model methods -> model as this binding
  var User = this;

  var decoded;

  //will throw err is anything goes wrong
  try{
    decoded = jwt.verify(token, 'abc123')
  } catch (e){
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result){
          resolve(user);
        }
        reject();
      })
    })

  })
}

UserSchema.pre('save', function(next){
  var user = this;

  if (user.isModified('password')) {
    //user.password

    ///var password = user.password;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })
    });
  } else {
    next();
  }//true if modified; false if not; encrypt if modified
})


var User = mongoose.model('User', UserSchema);


module.exports = {
  User
}
