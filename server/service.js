const express = require('express');
const moment = require('moment');
const request = require('superagent');
const {timeZoneApiKey, geocodingApiKey} = require('../secret/googleMapApiKey');

const service = express();

service.use(express.json());


service.get('/service/:location', (req, res, next) => {
  const locationAddress = req.params.location;

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationAddress}&key=${geocodingApiKey}`;

  request.get(geocodeUrl, (err, response) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const location = response.body.results[0].geometry.location;
    const {lat, lng} = location;

    const timestamp = +moment().format('X');

    const timezoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${timestamp}&key=${timeZoneApiKey}`;
    request.get(timezoneUrl, (err, response) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      const result = response.body;
      const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset).utc().format('dddd, MMMM, Do YYYY, h:mm:ss a');

      res.json({result: timeString});
    });
  });
});

module.exports = service;
