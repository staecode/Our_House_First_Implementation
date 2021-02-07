//uses express application

const express = require('express'); // package added via npm
const app = express(); // can use utility methods, functionality etc
const morgan = require('morgan'); // logging
const bodyParser = require('body-parser'); // parse requests - url encoded or json

const userRoutes = require('./api/routes/users');
const roomRoutes = require('./api/routes/rooms');

// logging w/format
app.use(morgan('dev'));

// which bodies are we parsing, javascript object confirguration simple bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// middleware!
// routes that will handle requests
// route, route handler
app.use('/users', userRoutes);
app.use('/rooms', roomRoutes);

// error handling, no routes caught request 
// control has reached function
app.use((req, res, next)=> {
    // create error object
    const error = new Error('Not Found');
    error.status = 404;
    // pass error along to next handle
    next(error);
});
// 600 errors will reach this error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//// for initial port test
//// request, response, execute next() (move request to next middleware in line)
// app.use((req, res, next) => {
//     
//     // 200 = everything ok
//     // javascript object always in string format
//     // res.status(200).json({
//     //     message: 'It works!'
//     // });
// });

module.exports = app;