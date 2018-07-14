// Library imports
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const router = express.Router();

// Local Imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

// <<<<<<< MIDDLEWARE HANDLERS >>>>>>>
app.use(bodyParser.json());
// <<<<<<<<<<<<<<<<->>>>>>>>>>>>>>>>>>>


// <<<<<<< ROUTES >>>>>>>
app.route('/todos')

    // Get the data from (GET localhost:3000/todos)
   .get((req, res, next) => {
        Todo.find()
        .then((todos) => {
            res.send({ todos });
        })
        .catch((error) => {
            res.status(400).send(error);
        });
   })

   // Post the data to (POST localhost:3000/todos)
   .post((req, res, next) => {
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
   })


app.route('/todos/:id')

   // Get a specific todo by ID (GET localhost:3000/todos/:id)
   .get((req, res, next) => {
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

   // Delete a specific todo by ID (DELETE localhost:3000/todos/:id)
   .delete((req, res, next) => {
        const id = req.params.id;
        
        // Validate user id using isValid()
        if (!ObjectID.isValid(id)) {
            res.status(404).send({})
        }

        // Find todo by ID
        Todo.findByIdAndRemove(id)
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


app.listen(port, () => {
    console.log(`Startrd on port ${port}`);
});

module.exports.app = app;

// app.post('/todos', (req, res, next) => {
//     const todo = new Todo({
//         text: req.body.text
//     });

//     todo.save()
//         .then((doc) => {
//             res.send(doc);
//         })
//         .catch((error) => {
//             res.status(400).send(error);
//         })
// });

// app.get('/todos', (req, res, next) => {
//     Todo.find()
//         .then((todos) => {
//             res.send({ todos });
//         })
//         .catch((error) => {
//             res.status(400).send(error);
//         });
// });

// app.get('/todos/:id', (req, res, next) => {
//     const id = req.params.id;
    
//     // Validate user id using isValid()
//     if (!ObjectID.isValid(id)) {
        
//         res.status(404).send({})
//     }

//     // Find todo by ID
//     Todo.findById(id)
//         .then((todo) => {
//             if (!todo) {
//                 return res.status(404).send();
//             }
//             res.send({todo});
//         })
//         .catch((error) => {
//             res.status(404).send(error);
//         });
// });

// app.delete('/todos/:id', (req, res, next) => {
//     const id = req.params.id;

//     // Validate user id using isValid()
//     if (!ObjectID.isValid(id)) {
//         res.status(404).send({})
//     }

//     Todo.findByIdAndRemove(id)
//         .then((todo) => {
//             if (!todo) {
//                 return res.status(404).send();
//             }
//             res.send({todo});
//         })
//         .catch((error) => {
//             res.status(404).send(error);
//         });
// });