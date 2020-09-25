
const mongoose = require("mongoose");

const WeatherDataSchema = new mongoose.Schema({
    temperature: Number,
    rainfall: Number,
    wind_speed: Number,
    location: String,
    date: String
});

WeatherDataSchema.index({location: 1, date: 1}, {unique: true});

export const WeatherData = mongoose.model("weather", WeatherDataSchema);
