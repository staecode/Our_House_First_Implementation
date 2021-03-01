//node server

const http = require('http'); //provides functionality for spinning up a sever
const app = require('./app'); //automatically looking or js files

// would be set on server I provide the product on, else default
const port = process.env.PORT || 5000; 

//need to pass a listener to execute funtion for each new request
const server = http.createServer(app); 

//starts listening on this port, start executing whatever request is received via listener.
server.listen(port); 