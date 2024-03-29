const expect = require('expect');
const request = require('supertest');
const {ObjectID} =require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1)
    })
    .end(done);
  })
})

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text)
    })
    .end(done)
  })


  it('should not return a todo doc created by another user', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('should return a 404 if todo not found', (done) => {
    var id = new ObjectID();

    request(app)
    .get(`/todos/${id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should return a 404 for a non-object IDs', (done) =>{
    request(app)
    .get('/todos/123')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done)
  })
})

describe('DELETE /todos/:id', () =>{
  it('should remove a todo', (done) => {
    //send request
    //query DB to ensure todo was deleted
    var hexId = todos[1]._id.toHexString(); //convert to string

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) =>{
        if (err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => {
          done(e);
        })
      })
  })


  it('should not remove a todo created by another user', (done) => {
    //send request
    //query DB to ensure todo was deleted
    var hexId = todos[0]._id.toHexString(); //convert to string

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) =>{
        if (err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => {
          done(e);
        })
      })
  })

  it('should return 404 if todo not found', (done)=>{
    var hexId = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done)
  })

  it('should return 404 if object id is invalid', (done)=>{
    request(app)
    .delete('/todos/123')
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done)
  })
})


describe('PATCH /todos/:id', () =>{
  it('should update the todo', (done) =>{

    var hexId = todos[0]._id.toHexString()
    var text = 'This should be the next text'

    request(app)
    .patch(`/todos/${hexId}`).send(
      {completed: true,
       text})
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      //expect(res.body.todo.completedAt).toBeA('number');
      expect(typeof(res.body.todo.completedAt)).toBe('number');
    })
    .end(done)
  });

  it('should not update todo created by a different user', (done) =>{
    var hexId = todos[0]._id.toHexString()
    var text = 'This should be the next text'

    request(app)
    .patch(`/todos/${hexId}`).send(
      {completed: true,
       text})
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done)
  });

  it('should clear completedAt when todo is not completed', (done) =>{
    //grab ID of second todo item
    var hexId = todos[1]._id.toHexString()

    var text = 'This should be the new text'
    //auth as second user

    request(app)
    .patch(`/todos/${hexId}`).send(
      {completed: false,
       text})
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeFalsy();
    })
    .end(done)
})
})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', (done) => {
    //make call to /users/me
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy(); //want to ensure value exists
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e))
      });
  })

  it('should return validation errors if request invalid', (done) => {
    //invalid email
    //invalid password
    //expect 400
    var email = '12345';
    var password = 'asdf'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  })

  it('should not create user if email in use', (done) => {
    var email = users[0].email
    var password = users[0].password

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);

  })

})

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy()
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.toObject().tokens[1].toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            }))
            done();
          }).catch((e) => done());
        })
  })

  it('should reject invalid login', (done) => {
    //pass invalid password; 200->400; no x-ath token; user tokens.length = 0
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy()
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length()).toEqual(1);
          done();
        }).catch((e) => done());
      })
  })
})


describe('DELETE /users/me/token', (done) => {
  //when real valid x-auth token, it actually gets logged route
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(users[0].tokens.length).toBe(0);
          done();
        }).catch((e) => done());
      })


  })
})
