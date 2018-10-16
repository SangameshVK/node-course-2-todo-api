var expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require("./../server.js");
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () =>{
    it('should create a new todo', (done) => {
        var text = 'asdfds';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it("Should not create todo with invalid body", (done) => {
        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(todos.length);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GEt /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect((res) => {
                    expect(res.body.todos.length).toBe(todos.length);
                });
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get todo for valid id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${(new ObjectID()).toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 if ID not valid', (done) => {
        request(app)
            .get('/todos/1234')
            .expect(400)
            .expect((res) => {
                expect(res.body.error).toBe("ID invalid");
            })
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${(new ObjectID()).toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/1234')
            .expect(400)
            .expect((res) => {
                expect(res.body.error).toBe("ID invalid");
            })
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first item
        // update text, set completed true
        // 200
        // text is changed, completed is true, completedAt is a number (tobea)
        var hexId = todos[0]._id.toHexString();
        //console.log(hexId);
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text : "Program changed text",
                completed : true
            })
            .expect(200)
            .expect((res) => {
                //console.log("Asserting theses");
                expect(res.body.todo.text).toBe("Program changed text");
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err, res) => {
                Todo.findById(hexId).then(todo => {
                    expect(todo.text).toBe("Program changed text");
                    expect(todo.completed).toBe(true);
                    expect(todo.completedAt).toBeA('number');
                    done();
                }).catch(e => done(e));
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        //console.log(hexId);
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text : "Program changed text",
                completed : false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe("Program changed text");
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end((err, res) => {
                Todo.findById(hexId).then(todo => {
                    expect(todo.text).toBe("Program changed text");
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toNotExist();
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            }).end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mbcd';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            }).end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                });
            });
    });

    it('should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({'email' :'abcdef', 'password' : 'a!'})
            .expect(400)
            .end(done);
    });

    it('should not create user if email is duplicate', (done) => {
        request(app)
            .post('/users')
            .send({'email' :'jen@example.com', 'password' : 'a!'})
            .expect(400)
            .end(done);
    });
});