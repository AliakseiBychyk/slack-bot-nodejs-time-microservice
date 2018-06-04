const express = require('express');
const request = require('superagent');
const googleMapApiKey = require('../secret/googleMapApiKey');

const service = express();

service.use(express.json());


service.get('/service/:location', (req, res, next) => {
  const locationAddress = req.params.location;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationAddress}&key=${googleMapApiKey}`;

  request.get(url, (err, response) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    res.json(response.body);
    // res.json(response.body.results[0].geometry.location);

  });
});

module.exports = service;
