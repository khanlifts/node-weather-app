// pull in modules
const yargs = require('yargs');
const axios = require('axios');

// configure yargs
const argv = yargs
  .options({
    'address': {
      demand: true,
      describe: 'Address of weather location',
      alias: 'a',
      string: true
    }
  })
  .help()
  .argv

// store and encode input and provide default address (my home)
var address = argv.address;
const default_address = 'Kornstrasse 3 8603 Schwerzenbach'
var encodedAddress = encodeURIComponent(address);
const geocodeAPIKey = 'AIzaSyCcMTNXWp5NVnrrDX6nwI5NV91hXO8vLAY';
if (argv.address === '') {
  address = default_address;
}
var geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=$${address}&key=${geocodeAPIKey}`;

// get location data from google API
axios.get(geocodeURL).then((response) => {
  // handle possible error
  if (response.status === 'ZERO_RESULTS') {
    console.log('Keine Verbindung zur geoCode API möglich');
  }
  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;
  var weatherURL = `https://api.darksky.net/forecast/b2161bf990c465f06b04ccc9ea43bbd0/${lat},${lng}`;

  console.log(`Die Adresse ist: ${response.data.results[0].formatted_address}`);

  return axios.get(weatherURL);

  // get data from darksky API and calculate degrees celsius
}).then((response) => {
  var temp = response.data.currently.temperature;
  var summary = response.data.currently.summary;
  var wind = response.data.currently.windSpeed;

  var c_temp = Math.round((temp-32)/1.8);

  console.log(`Das Wetter ist momentan (engl.) ${summary}
              mit einer Temperatur von ${temp} und
              einer Windgeschwindigkeit von ${wind} km/h.`);
  // handle possible error
}).catch((e) => {
  if (e.code === 'ENOTFOUND') {
    console.log('Keine Verbindung zur Wetter API möglich.');
  } else {
    console.log(e.message);
  }
})
