//node server

const http = require('http'); //provides functionality for spinning up a sever
const app = require('./app'); //automatically looking or js files

const port = process.env.PORT || 3000; // would be set on server I provide the product on, else default

const server = http.createServer(app); //need to pass a listener to execute funtion for each new request

server.listen(port); //starts listening on this port, start executing whatever request is received via listener.