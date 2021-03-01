//uses express application

const express = require('express'); // package added via npm
const morgan = require('morgan'); // logging
const bodyParser = require('body-parser'); // parse requests - url encoded or json
const mongoose = require('mongoose'); // database interface tool


// express router
const userRoutes = require('./api/routes/users');
const roomRoutes = require('./api/routes/rooms');

// connect to database
mongoose.connect(
    'mongodb+srv://Staecode:' + 
    process.env.MONGO_ATLAS_PW + 
    '@cluster0.nmmfj.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

// for development, see warnings in terminal
process.on('warning', (warning) => {
    console.warn(warning.name);    // Print the warning name
    console.warn(warning.message); // Print the warning message
    console.warn(warning.stack);   // Print the stack trace
});

const app = express(); // can use utility methods, functionality etc

// logging w/format
app.use(morgan('dev'));

// which bodies are we parsing, javascript object confirguration simple bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// ensure that we prevent CORS errors
app.use((req, res, next) => {
    // set header to append access header to all responses
    res.header('Access-Control-Allow-Origin', '*');
    // set header permissions
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers, Access-Control-Request-Method, Access-Control-Request-Headers');
    // give option answer to browser
    if(req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        res.status(200).json({});
    }
    // move on
    next();
})

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