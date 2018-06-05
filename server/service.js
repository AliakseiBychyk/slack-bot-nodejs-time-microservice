const express = require('express');
const moment = require('moment');
const request = require('superagent');
const {timeZoneApiKey, geocodingApiKey} = require('../secret/googleMapApiKey');

const service = express();

service.use(express.json());

const timeZoneAPIKey = process.env.TIME_ZONE_API_KEY || timeZoneApiKey;
const geocodingAPIKey = process.env.GEOCODE_API_KEY || geocodingApiKey;

service.get('/service/:location', (req, res, next) => {
  const locationAddress = req.params.location;

  request.get('https://maps.googleapis.com/maps/api/geocode/json')
    .query({ address: locationAddress, key: geocodingAPIKey })
    .end((err, response) => {
      if (err) {
        console.error(err);
        return res.sendStatus(500);
      }

      const location = response.body.results[0].geometry.location;
      const {lat, lng} = location;

      const timestamp = +moment().format('X');

      request.get('https://maps.googleapis.com/maps/api/timezone/json')
        .query({
          location: `${lat},${lng}`,
          timestamp,
          key: timeZoneAPIKey,
        })
        .end((err, response) => {
          if (err) {
            console.error(err);
            return res.sendStatus(500);
          }

          const result = response.body;
          const timeString = moment
            .unix(timestamp + result.dstOffset + result.rawOffset)
            .utc()
            .format('dddd, MMMM, Do YYYY, h:mm:ss a');

          res.json({result: timeString});
        });
    });
});

module.exports = service;
