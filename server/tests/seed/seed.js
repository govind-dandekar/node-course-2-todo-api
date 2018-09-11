const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken')


const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'govind@example.com',
  password: 'user1pass',
  tokens: [
    {
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }
  ]
}, {
  _id: userTwoId,
  email: 'iyla@example.com',
  password: 'user2pass'
}]

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 123
}];


//testing life cycle -- wipe Todos
const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos); //will NOT run middleware
  }).then(() => done()); //this will wipe all Todos
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save(); //by calling save, we're running middleware
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
}

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
