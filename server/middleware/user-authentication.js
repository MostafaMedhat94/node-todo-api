'use strict'
const {User} = require('../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth');

    // Find user by token
    User.findByToken(token)
        .then((user) => {
            if (!user) {
                return Promise.reject();
            }

            // Modify the request to be handled by the route
            req.user = user;
            req.token = token;

            // Go for GET /users/me
            next();
        })
        .catch((error) => {
            res.status(401).send(error);
        });
};

module.exports = {authenticate};
