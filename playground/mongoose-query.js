const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = '5b470abf271789b91df996a7';
const user = new User({
    email: 'ralph@lauren.com'
});

if (!ObjectID.isValid(id)) {
    return console.log('ID is not valid');
}

// Query 1
Todo.find({
    _id: id
})
.then((todos) => {
    console.log('Todos:', todos);
})
.catch((error) => {
    console.error(error);
})

// Query 2
Todo.findOne({
    _id: id
})
.then((todo) => {
    console.log('Todo:', todo);
})
.catch((error) => {
    console.error(error);
})

// Query 3
Todo.findById(id)
    .then((todo) => {
        if (!todo) {
            return console.log('ID not found');
        }
        console.log('Todo:', todo);
    })
    .catch((error) => {
        console.error(error);
    })

// TODO User.findById
User.findById('5b473ef626eb038730ce1629')
.then((user) => {
    if (!user) {
        console.log('USer not found');
    }
})
.catch((error) => {
    console.error(error);
})