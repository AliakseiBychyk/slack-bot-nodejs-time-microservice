const http = require('http');
const request = require('superagent');
const service = require('../server/service');

const server = http.createServer(service);

server.listen();

server.on('listening', () => {
  console.log(`TIME-microservice is listening on ${server.address().port} in ${service.get('env')} mode`);

  const announce = () => {
    request.put(`http://127.0.0.1:3000/service/time/${server.address().port}`, (err, res) => {
      if (err) {
        console.error(err);
        console.log('Error connecting to Bibop-bot');
      }

      console.log(res.body);
    });
  };
  announce();
  setInterval(announce, 15 * 1000);
});
