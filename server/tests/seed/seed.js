'use strict'

// Library imports
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

// Local imports
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

// Global variables
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [
    {
        _id: new ObjectID(),
        text: 'First test todo',
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed: true,
        completedAt: 333,
        _creator: userTwoId
    },
];


const users = [
    {
        _id: userOneId,
        email: 'mostafa.medhat@me.com',
        password: 'noPassForKiddos',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'mohamed.mansour@me.com',
        password: 'noPassForLadies',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
    }
];

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos)
        })
        .then(() => done());
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            const userOne = new User(users[0]).save();
            const userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
}

module.exports = {todos, populateTodos, users ,populateUsers};
