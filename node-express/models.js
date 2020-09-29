
const mongoose = require("mongoose");

const WeatherDataSchema = new mongoose.Schema({
    temperature: Number,
    rainfall: Number,
    wind_speed: Number,
    location: String,
    date: String
});

export const WeatherData = mongoose.model("weather", WeatherDataSchema);
