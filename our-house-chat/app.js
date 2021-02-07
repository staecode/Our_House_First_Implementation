//uses express application

const express = require('express'); //package added via npmf

const app = express(); // can use utility methods, functionality etc

const userRoutes = require('./api/routes/users');
const roomRoutes = require('./api/routes/rooms');

// middleware!
// route, route handler
app.use('/users', userRoutes);
app.use('/rooms', roomRoutes);

// app.use((req, res, next) => {
//     // for initial port test
//     // request, response, execute next() (move request to next middleware in line)
//     // 200 = everything ok
//     // javascript object in string format
//     // res.status(200).json({
//     //     message: 'It works!'
//     // });
// });

module.exports = app;