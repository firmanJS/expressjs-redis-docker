const express = require('express');
const redis = require('redis');
const axios = require('axios');

const client = redis.createClient({
  host: 'redis',
  port: 6379,
});
const expireTime = 800; // set expire time redis
const app = express();

app.get('/', (req, res) => {
  client.get('SecretKeyRedis', async (err, result) => {
    if (result) {
      const resultJSON = JSON.parse(result);
      res.status(200).json({
        source: 'redis source',
        callback: resultJSON,
      });
    } else {
      const urlApi = 'http://api.aladhan.com/v1/calendarByCity?city=Bandung&country=ID&method=11';
      const JadwalAdzan = await axios.get(urlApi);
      client.setex('SecretKeyRedis', expireTime, JSON.stringify(JadwalAdzan.data)); // set redis key
      res.json({
        source: 'api source',
        callback: JadwalAdzan.data,
      });
    }
  });
});

app.listen(3000);
// eslint-disable-next-line no-console
console.log('app running in port 3000');
