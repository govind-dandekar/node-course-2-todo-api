const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');

//testing life cycle -- wipe Todos
beforeEach((done) => {
  Todo.remove({}).then(() => {
    done();
  }); //this will wipe all Todos
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
      Todo.find().then((todos) => {
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
        expect(todos.length).toBe(0);
        done();
      }).catch((e) => {
        done(e);
      })
    })
  })
})
