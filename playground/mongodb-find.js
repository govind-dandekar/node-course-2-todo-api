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

  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, (err) => {
    console.log('Unable to fetch todos', err)
  })

  db.collection('Users').find({name: 'Cassius'}).toArray().then((docs) => {
    console.log('Users');
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch users', err);
  })


  // db.collection('Todos').find({
  //     _id: new ObjectID('5b85c00fb46f048e4aac50cb')
  //   }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2))
  // }, (err) => {
  //   console.log('Unable to fetch todos', err)
}); //no query provided -> find() returns a point to the doc
                                                //toArray returns a promis



  //db.close();  //close connection with mongodb server


//don't have to create DB before using it (declare name and DB exists)
