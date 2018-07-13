// Library imports
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

// Local Imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then((doc) => {
            res.send(doc);
        })
        .catch((error) => {
            res.status(400).send(error);
        })
});

app.get('/todos', (req, res) => {
    Todo.find()
        .then((todos) => {
            res.send({ todos });
        })
        .catch((error) => {
            res.status(400).send(error);
        })
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    
    // Validate user id using isValid()
    if (!ObjectID.isValid(id)) {
        
        res.status(404).send({})
    }

    // Find todo by ID
    Todo.findById(id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({todo});
        })
        .catch((error) => {
            res.status(404).send(error);
        });
})

app.listen(3000, () => {
    console.log('Startrd on port 3000');
})

module.exports.app = app;