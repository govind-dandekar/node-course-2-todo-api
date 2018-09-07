const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash')

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


var User = mongoose.model('User', UserSchema);


module.exports = {
  User
}
