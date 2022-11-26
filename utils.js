const request = require('postman-request');
const chalk = require('chalk');
const keys = require('./keys.js');

const mapboxKey = keys.mapboxKey;
const weatherStackKey = keys.weatherStackKey;

const getCoordinates = (locationName, callback) => {
	const mapbox = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
	const getrequest = mapbox + encodeURIComponent(locationName) + '.json' + '?access_token=' + mapboxKey + '&limit=1';
	request(
		{
			uri: getrequest,
			json: true
		},
		(error, { body }) => {
			if (error) {
				callback(chalk.red('Unable to connect to MapBox'));
			} else if (body.features.length === 0) {
				callback(chalk.red('Unable to find requested location'));
			} else {
				const data = body.features[0];
				const placeName = data.place_name;
				const coordinates = data.center;
				callback(undefined, {
					placeName: placeName,
					longitude: coordinates[0],
					latitude: coordinates[1]
				});
			}
		}
	);
};

const forecast = (longitude, latitude, callback) => {
	const url = `http://api.weatherstack.com/current?access_key=${weatherStackKey}&query=${latitude},${longitude}&units=f`;
	request(
		{
			uri: url,
			json: true
		},
		(error, { body }) => {
			if (error) {
				callback(chalk.red('No Connection to WeatherStack'));
			} else if (body.error) {
				callback(chalk.red('Unable to find weather by location'));
			} else if (!body.location.name) {
				callback(chalk.red('No match found in WeatherStack'));
			} else {
				callback(undefined, {
					description: body.current.weather_descriptions[0],
					temperature: body.current.temperature,
					feelsLike: body.current.feelslike
				});
			}
		}
	);
};

/*outputTemperature logs simple weather info to console
 *@param {number} [temp]
 *@param {number} [feelsLike]
 */
const outputTemperature = (temp = 404, feelsLike = 404) =>
	console.log('It is currently ' + temp + ' degrees outside. It feels like ' + feelsLike + ' degrees.');

module.exports = { getCoordinates, forecast, outputTemperature };
