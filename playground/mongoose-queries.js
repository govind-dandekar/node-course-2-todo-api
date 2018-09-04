const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectID} =require('mongodb');
const {User} = require('./../server/models/user')

var id = '5b885d2a82f677e22df28fcb';

// if (!ObjectID.isValid(id)){ //add IF condition to validate ID
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: id //pass in String as ID and converts to Object ID
// }).then((todos) => {
//   console.log('Todos', todos)
// });
//
// Todo.findOne({ //will return one document at mosr
//   _id: id //
// }).then((todo) => {
//   console.log('Todos', todo)
// })

// Todo.findById(id).then((todo) => {
//   //case when ID is not correct
//   //API will get ID from the User
//
//   if(!todo) {
//     return console.log('ID not found');
//   }
//   console.log('Todo By ID', todo);
// }).catch((e) => console.log(e));

//query the Users colelction -- grab an ID from RM
//load in the User mongoose model
//User.findById()
//1 - query works but there is no user: User not found
//2 - user was found == print to screen
//3 -- errors that may occur; no need to use isValid

if (!ObjectID.isValid(id)){
  console.log('UserID is invalid');
}

User.findById(id).then((user) => {
  if (!user) {
    return console.log('Unable to find user')
  }
  console.log(JSON.stringify(user, undefined, 2))
}, (error) => {
  console.log(error);
})
