'use strict'

// Library imports
const {ObjectID} = require('mongodb');
const express = require('express');
const _ = require('lodash');

// Initializing TodoMainRouter
const MainUserRouter = express.Router();

// Local imports
const {User} = require('../../models/user');

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
              })

module.exports = MainUserRouter;
