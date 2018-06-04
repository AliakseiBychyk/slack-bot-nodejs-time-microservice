const http = require('http');
const service = require('../server/service');

const server = http.createServer(service);

server.listen(3010);

server.on('listening', () => {
  console.log(`TIME-microservice is listening on ${server.address().port} in ${service.get('env')} mode`);
});
