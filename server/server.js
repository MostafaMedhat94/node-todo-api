'use strict'

require('./config/config');

// Library imports
const express = require('express');
const bodyParser = require('body-parser');

// Local Imports
const todosRouter = require('./routes/todos/todos');
const usersRouter = require('./routes/users/users');
const {mongoose} = require('./db/mongoose');


const app = express();
const port = process.env.PORT || 3000;

// <<<<<<< MIDDLEWARE HANDLERS >>>>>>>
app.use(bodyParser.json());
// <<<<<<<<<<<<<<<<->>>>>>>>>>>>>>>>>>>


// <<<<<<<<<< ROUTES >>>>>>>>>>
app.use('/todos', todosRouter);
app.use('/users', usersRouter);
// <<<<<<<<<<<<<->>>>>>>>>>>>>>>



app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports.app = app;
