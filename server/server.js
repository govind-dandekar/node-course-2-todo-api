require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} =require('mongodb');
const _ = require('lodash');


var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');

var app = express();

const port = process.env.PORT;



app.listen(port, () => {
  console.log(`Started on port ${port}`);
}) // server up


app.use(bodyParser.json()) //middleware that we need to give to express

//to create a resource, send POST
//text prop->make model->send model (complete) back
app.post('/todos', (req, res) => {
  //use bodyParser to get data sent from Canada
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
})


app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
})


app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)){
    res.status(404).send();
  } else {
    Todo.findById(id).then((todo) => {
      if(!todo){
        res.status(404).send();
      } else {
        res.send({todo});
      }
    }, (e) => {
      res.status(400).send();
    })
  }
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

if (!ObjectID.isValid(id)){
  res.status(404).send();
} else {
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      res.status(404).send();
    } else {
      res.send({todo});
    }
  }, (e) => {
    res.status(400).send();
  })
}
})

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  //updates will be stored within the body
  //user can send along properties that aren't part of object or we don't want to update (completedAt)

  //created body var with subset of things
  var body = _.pick(req.body, ['text', 'completed']) //users can only updated two properties

  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  //set completedAt
  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime(); //returns JS timestamp -- MS from Jan 1 1970
  } else {
    //when update makes the boolean false
    body.completed = false;
    body.completedAt = null; //when
  }
  //make query to update DB
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
})

// POST /users
app.post('/users', (req, res) =>{
    //need to return auth token at signup

    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body);

    //model vs instance (User vs user)

    //User.findByToken() //doesn't require single user -> will create (doesn't exist in Mongoose)
    //user.generateAuthToken(); //add token to the individual user doc -> save -> send to user
    //need userId, etc

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
})


module.exports = {app};
