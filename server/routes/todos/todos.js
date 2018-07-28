'use strict'

// Library imports
const {ObjectID} = require('mongodb');
const express = require('express');
const _ = require('lodash');

// Local imports
const {authenticate} = require('../../middleware/user-authentication');

// Initializing TodoMainRouter
const MainTodoRouter = express.Router();

// Local imports
const {Todo} = require('../../models/todo');

// Todos root
MainTodoRouter.route('/')
              // GET all todos
              .get(authenticate, (req, res, next) => {
                    Todo.find({
                        _creator: req.user.id
                    })
                    .then((todos) => {
                        res.send({ todos });
                    })
                    .catch((error) => {
                        res.status(400).send(error);
                    });
              })

              // Add a new todo
              .post(authenticate, (req, res, next) => {
                    const todo = new Todo({
                        text: req.body.text,
                        _creator: req.user._id
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
              .get(authenticate, (req, res, next) => {
                    const id = req.params.id;

                    // Validate user id using isValid()
                    if (!ObjectID.isValid(id)) {

                        res.status(404).send({})
                    }
                    // Find todo by ID
                    Todo.findOne({
                        _id: id,
                        _creator: req.user._id
                    })
                    .then((todo) => {
                        if (!todo) {
                            return res.status(404).send();
                        }
                        res.send({todo});
                    })
                    .catch((error) => {
                        res.status(404).send();
                    });
              })

              // DELETE a specific todo by ID
              .delete(authenticate, (req, res, next) => {
                    const id = req.params.id;

                    // Validate user id using isValid()
                    if (!ObjectID.isValid(id)) {
                        res.status(404).send({})
                    }
                    Todo.findOneAndRemove({
                        _id: id,
                        _creator: req.user._id
                    })
                    .then((todo) => {
                        if (!todo) {
                            return res.status(404).send();
                        }
                        res.send({todo});
                    })
                    .catch((error) => {
                        res.status(404).send();
                    });
              })

              // UPDATE a specific todo
              .patch(authenticate, (req, res, next) => {
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

                  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true})
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

module.exports = MainTodoRouter;
