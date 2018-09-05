const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectID} =require('mongodb');
const {User} = require('./../server/models/user')




Todo.findByIdAndRemove('5b8f5a70fc0fd652f649e9a7').then((todo) => {
  console.log(todo);
})
