// const MongoClient = require('mongodb').MongoClient;


const {MongoClient, ObjectID} = require('mongodb'); //creates var called MongoClient = mongodb.MongoClient
//ObjectID let's us make new Obj IDs on the fly (create IDs w/o Mongo)

// var obj = new ObjectID();
// console.log(obj); // can create our own (generally easier to let mongo do this)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) =>{
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  } //return ensures the rest of the f(x) doesn't execute
  // or add an else
  console.log('Connected to MongoDB server');

  //findOneAndUpdate similar to findOneAndDelete
  //will get doc in response

  // db.collection('Todos').findOneAndUpdate(
  //   {_id: new ObjectID('5b86169eb46f048e4aac62c6')}
  // , {
  //   $set: { //have to use update operators
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // })

  // db.collection('Users').findOneAndUpdate(
  //   {
  //     _id: new ObjectID('5b81d6569ec7b5238e59fc1b')
  //   }, {
  //     $set: {
  //       name: 'Govind'
  //     }
  //   },{
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result)
  // })

  db.collection('Users').findOneAndUpdate(
    {
      _id: new ObjectID('5b81d6569ec7b5238e59fc1b')
    },
    {
      $set: {name: 'Govind'},
      $inc: {age: 1}
    }
  ,{
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  })

  //db.close()

});
