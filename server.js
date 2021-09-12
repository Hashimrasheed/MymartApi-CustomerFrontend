const http = require('http');
const app = require('./app');

const port = process.env.PORT || 9001;

const server = http.createServer(app);
console.log(`server is running at port ${port}`)
server.listen(port);