"using strict";

const chalk = require("chalk");
const getCoordinates = require("./utils").getCoordinates;
const outputTemperature = require("./utils").outputTemperature;
const forecast = require("./utils").forecast;

const locationRequest = process.argv[2];
if (!locationRequest) {
    console.log(chalk.red("Please append address to search following app.js"));
    console.log(chalk.red("e.g.:> node app.js \"New Orleans\" "));
    process.exit(1);    //terminate program if no address available
}

getCoordinates(locationRequest, (error, {placeName, longitude, latitude} = {}) => {
    if (error) {
        console.log(error)
    } else {
        console.log(chalk.inverse(placeName));
        console.log(chalk.greenBright("Longitude: " + longitude));
        console.log(chalk.greenBright("Latitude: " + latitude));

        forecast(longitude, latitude, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(chalk.italic(res.description));
                outputTemperature(res.temperature, res.feelsLike);
            }
        });
    }
});