const {ObjectID} = require('mongodb');
const expect = require('expect');
const request = require('supertest');

const {app} = require('../../server/server');
const {Todo} = require('../../server/models/todo');

const todos = [
    {
        _id: new ObjectID(),
        text: 'First test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt: 333
    },
    {
        _id: new ObjectID(),
        text: 'Third test todo'
    },
];

beforeEach((done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos)
        })
        .then(() => done());
})

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        const text = 'Test todo text';

        request(app)
            .post('/todos')
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
                        done();
                    })
                    .catch((error) => done(error));
            })
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then((todos) => {
                        expect(todos.length).toBe(3);
                        done()
                    })
                    .catch((error) => done(error));
            })
    });
});

'use strict'

describe('GET /todos', () => {
    it('should retrieve all the todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        const hexID =  new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get(`/todos/abc123`)
            .expect(404)
            .end(done);
    });
});


describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const hexID = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexID}`)
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
                        done();
                    })
                    .catch((error) => done(error));
            })
    });

    it('should return 404 if todo not found', (done) => {
        const hexID =  new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/abc123`)
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

    it('should clear completedAt when todo is not completed', (done) => {
        // grab the id of the second item
        const hexID = todos[1]._id.toHexString();

        // udpate text, set completed to false
        const text = 'This should be the new text!!';

        request(app)
            .patch(`/todos/${hexID}`)
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