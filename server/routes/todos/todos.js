'use strict'

// Library imports
const {ObjectID} = require('mongodb');
const express = require('express');
const _ = require('lodash');

// Initializing TodoMainRouter
const MainTodoRouter = express.Router();

// Local imports
const {Todo} = require('../../models/todo');

// Todos root
MainTodoRouter.route('/')
              // GET all todos
              .get((req, res, next) => {
                    Todo.find()
                    .then((todos) => {
                        res.send({ todos });
                    })
                    .catch((error) => {
                        res.status(400).send(error);
                    });
              })
              
              // Add a new todo
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
// ================================================== //

// Specific todo by ID
MainTodoRouter.route('/:id')
              // GET a specific todo by ID
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

              // DELETE a specific todo by ID
              .delete((req, res, next) => {
                    const id = req.params.id;

                    // Validate user id using isValid()
                    if (!ObjectID.isValid(id)) {
                        res.status(404).send({})
                    }
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

              // Update a specific todo
              .patch((req, res, next) => {
                  const id = req.params.id;

                  // Restrict the updatable paramters using _.pick()
                  const body = _.pick(req.body, ['text', 'completed']);
                  
                  // Validate user id using isValid()
                  if (!ObjectID.isValid(id)) {
                      res.status(404).send({})
                  }

                  // Check whether todo.completed prorperty is true
                  if (_.isBoolean(body.completed) && body.completed) {
                      body.completedAt = new Date().getTime();
                  } else {
                      body.completed = false;
                      body.completedAt = null;
                  }

                  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
                      .then((todo) => {
                          if (!todo) {
                              return res.status(400).send();
                          }
                          res.send({todo});
                      })
                      .catch((error) => {
                          res.status(400).send(error);
                      })
              })
// ================================================== //


// MainTodoRouter.get('/', (req, res, next) => {
//     Todo.find()
//         .then((todos) => {
//             res.send({ todos });
//         })
//         .catch((error) => {
//             res.status(400).send(error);
//         });
// });

// // Add a new todo
// MainTodoRouter.post('/', (req, res, next) => {
//     const todo = new Todo({
//         text: req.body.text
//     });
//     todo.save()
//      .then((doc) => {
//          res.send(doc);
//      })
//      .catch((error) => {
//          res.status(400).send(error);
//      })
// });

// // GET a specific todo by ID
// MainTodoRouter.get('/:id', (req, res, next) => {
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

// // DELETE a specific todo by ID
// MainTodoRouter.delete('/:id', (req, res, next) => {
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

module.exports = MainTodoRouter;