'use strict'

// Library imports
const {ObjectID} = require('mongodb');
const expect = require('expect');
const request = require('supertest');

// Local imports
const {app} = require('../../server/server');
const {Todo} = require('../../server/models/todo');
const {User} = require('../../server/models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text})
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                    })
                    .then(() => done(), done)
                    .catch((error) => done(error));
            })
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then((todos) => {
                        expect(todos.length).toBe(2);
                    })
                    .then(() => done(), done)
                    .catch((error) => done(error));
            })
    });
});

describe('GET /todos', () => {
    it('should retrieve all the todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not return todo doc created by another user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        const hexID =  new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/abc123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});


describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexID);
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                // query database using findById toNotExist
                Todo.findById(hexID)
                    .then((todo) => {
                        // expect(null).toNotExist();
                        expect(todo).toBeFalsy();
                    })
                    .then(() => done(), done)
                    .catch((error) => done(error));
            })
    });

    it('should not remove a todo created by another user', (done) => {
        const hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                // query database using findById toNotExist
                Todo.findById(hexID)
                    .then((todo) => {
                        // expect(null).toNotExist();
                        expect(todo).toBeTruthy();
                    })
                    .then(() => done(), done)
                    .catch((error) => done(error));
            })
    });

    it('should return 404 if todo not found', (done) => {
        const hexID =  new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/abc123`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab the id of the first item
        const hexID = todos[0]._id.toHexString();

        // update text, set completed true
        const text = 'This should be the new text';

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                text,
                completed: true,
            })
            .expect(200)

            // text is changed, completed is true, completedAt is number .toBe()
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done)
    });

    it('should not update todos created by another user', (done) => {
        // grab the id of the first item
        const hexID = todos[0]._id.toHexString();

        // update text, set completed true
        const text = 'This should be the new text';

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                text,
                completed: true,
            })
            .expect(400)
            .end(done)
    });

    it('should clear completedAt when todo is not completed', (done) => {
        // grab the id of the second item
        const hexID = todos[1]._id.toHexString();

        // udpate text, set completed to false
        const text = 'This should be the new text!!';

        request(app)
            .patch(`/todos/${hexID}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                text,
                completed: false,
            })
            .expect(200)

            // text is changed, completed is true, completedAt is number .toBe()
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            })
            .end(done)
        // 200
        // text is changed, completed is false, completedAt is null .toBeFalsy()
    })
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
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'you@me.us';
        const password = 'noPassForKiddos';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((error) => {
                if (error) {
                    return done(error);
                }

                User.findOne({email})
                    .then((user) => {
                        expect(user).toBeTruthy();
                        expect(user.password).not.toBe(password);
                    })
                    .then(() => done(), done);
            });
    });

    it('should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'non',
                password: '123'
            })
            .expect(400)
            .end(done);
    });

    it('shouldn\'t create a user if email already exists', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: '123'
            })
            .expect(400)
            .end(done);
    });
});

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
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens[1]).toMatchObject({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                    })
                    .then(() => done(), done)
                    .catch((err) => done(err));
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + 'invalidPassword'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(1);
                    })
                    .then(() => done(), done)
                    .catch((err) => done(err));
            });
    });
});
