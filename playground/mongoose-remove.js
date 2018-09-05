const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectID} =require('mongodb');
const {User} = require('./../server/models/user')

//mongoose deletion methods
// Todo.remove({}) -- delete all that match

// Todo.remove({}).then((res)=>{
//   console.log(res);
// }) // do not get docs back

// Todo.findOneAndRemove({}).then((res)=> {
//   //gets removed docs back
//
// })

// Todo.findOneAndRemove({'_id: '})


Todo.findByIdAndRemove('5b8f5a70fc0fd652f649e9a7').then((todo) => {
  console.log(todo);
})
