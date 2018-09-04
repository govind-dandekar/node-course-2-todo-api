var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} =require('mongodb');


var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user.js');
var {Todo} = require('./models/todo.js');

var app = express();

app.listen(3000, () => {
  console.log('Started on port 3000');
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

// GET /todos/id
// need to make id part dynamic --
//create id var on request object by appending :id
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  console.log('id: ', id);

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

  //res.send(req.params);
});

module.exports = {app};
