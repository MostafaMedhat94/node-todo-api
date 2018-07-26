'use strict'

// Library imports
const {ObjectID} = require('mongodb');
const express = require('express');
const _ = require('lodash');

// Initializing TodoMainRouter
const MainUserRouter = express.Router();

// Local imports
const {User} = require('../../models/user');
const {authenticate} = require('../../middleware/user-authentication');

MainUserRouter.route('/')

              // Get all the users
              .get((req, res, params) => {
                  User.find()
                  .then((users) => {
                      res.send({ users });
                  })
                  .catch((error) => {
                      res.status(400).send(error);
                  });
              })

              // Create new user
              .post((req, res, next) => {
                  // Pick just the necessary data
                  const body = _.pick(req.body, ['email', 'password']);
                  const user = new User(body);


                  user.save()
                      .then(() => {
                          return user.generateAuthToken();
                      })
                      .then((token) => {
                          res.header('x-auth', token).send(user);
                      })
                      .catch((error) => {
                          res.status(400).send(error);
                      });
              });

MainUserRouter.route('/me')
              // GET the user after authentication
              .get(authenticate, (req, res, next) => {
                  res.send(req.user);
              });


MainUserRouter.route('/login')
              // Find user by email and hashed password
              .post((req, res, next) => {
                  const body = _.pick(req.body, ['email', 'password']);

                  // Validate user by credentials
                  User.findByCredentials(body.email, body.password)
                      .then((user) => {
                          return user.generateAuthToken()
                              .then((token) => {
                                  res.header('x-auth', token).send(user);
                              });
                      })
                      .catch((error) => {
                          res.status(400).send(error);
                      });
              })

MainUserRouter.route('/me/token')
              // Logout user and clear his/her token
              .delete(authenticate, (req, res, next) => {
                  req.user.removeToken(req.token)
                          .then(() => {
                              res.status(200).send();
                          })
                          .catch((err) => {
                              res.status(400).send(err);
                          })
              })

module.exports = MainUserRouter;
