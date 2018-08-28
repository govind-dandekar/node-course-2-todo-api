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

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err)
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })//name of collection you want to insert


  //insert new doc into Users collection
  //name, age, locationString
  // db.collection('Users').insertOne({
  //   name: 'Cassius',
  //   age: 42,
  //   location: 'Louisville'
  // }, (err, result) => {
  //   if (err){
  //     return console.log('Unable to insert User', err)
  //   }
  //
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // })

  db.close();  //close connection with mongodb server
});

//don't have to create DB before using it (declare name and DB exists)
