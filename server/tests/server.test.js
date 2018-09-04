const expect = require('expect');
const request = require('supertest');
const {ObjectID} =require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');



const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},{
  _id: new ObjectID(),
  text: 'Second test todo'
}];

//testing life cycle -- wipe Todos
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done()); //this will wipe all Todos
})

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .send({text}) //will be converted to JSON by supertest
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err) {
        return done(err); //return stops fx execution
      }
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => {
        done(e);
      })
    })
  })


  it('should not create todo with invalid body data', (done) => {

    request(app)
    .post('/todos')
    .send() //will be converted to JSON by supertest
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err); //return stops fx execution
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => {
        done(e);
      })
    })
  })
})

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2)
    })
    .end(done);
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done)
  })

  it('should return a 404 if todo not found', (done) => {
    var id = new ObjectID();

    request(app)
    .get(`/todos/${id.toHexString()}`)
    .expect(404)
    .end(done)
  });

  it('should return a 404 for a non-object IDs', (done) =>{
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done)
  })
})
