const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello Doha ');
});

server.listen(3000, () => {
  console.log('http://localhost:3000');
});