require('./config/config')

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} =require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;



app.listen(port, () => {
  console.log(`Started on port ${port}`);
}) // server up


app.use(bodyParser.json()) //middleware that we need to give to express

//to create a resource, send POST
//text prop->make model->send model (complete) back
app.post('/todos', authenticate, (req, res) => {
  //use bodyParser to get data sent from Canada
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id //id of the user
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  })
})


app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
})


app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)){
    res.status(404).send();
  } else {
    Todo.findOne({
        _id: id,
        _creator: req.user._id
      }).then((todo) => {
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

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

if (!ObjectID.isValid(id)){
  res.status(404).send();
} else {
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
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

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

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
  Todo.findOneAndUpdate({_id: id, _creator: req.user.id}, {$set: body}, {new: true}).then((todo) => {
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

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
})

app.get('/users/me', authenticate, (req, res) => {
  //will be private
  res.send(req.user)
})


app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  //console.log(body);

  User.findByCredentials(body.email, body.password).then((user) => {

    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    })
    //res.send(user);
  }).catch((e) =>{
    res.status(400).send();
  })
})

app.delete('/users/me/token', authenticate, (req, res) => {
  //store token in authenticate middleware
  req.user.removeToken(req.token).then(() =>{
    res.status(200).send()
  }, () => {
    res.status(400).send();
  });

})


module.exports = {app};
