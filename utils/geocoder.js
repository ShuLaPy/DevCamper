const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.GEO_PROVIDER,
  apiKey: process.env.MAPQUEST_KEY,
  httpAdapter: "https",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
