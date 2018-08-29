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

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').deleteMany({name: 'Cassius'}).then((result) => {
  //   console.log(result);
  // })


  //deleteOne -- deleted first one that matches criteria
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // })

  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('5b86198cb46f048e4aac6425')
  }).then((result) => {
    console.log(JSON.stringify(result, undefined, 2))
  })

  //findOneAndDelete -- remove indiv item and return Todo value (tell user what was deleted)
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // })



  //db.close()

});
