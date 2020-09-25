const mongoose = require("mongoose");

import { WeatherData } from "./models.js";

export async function handleAddReq(req, res) {

  const location = req.body.location;
  const data = req.body.data;

  let results = await WeatherData.deleteMany({location: location});

  let dataWithLocation = data.map( obj => ( {...obj, location: location}) );

  results = await WeatherData.insertMany(dataWithLocation);

  res.status(200).send("");
}


export async function handleDataReq(req, res) {

  let location = req.params.location;

  const results =
  await WeatherData.find({ location:location, date: { $ne: null } })
        .select(['-_id','temperature','rainfall','wind_speed','date'])
        .exec();

  res.status(200).send(results);
}

export async function handleRemoveReq(req, res) {

  let location = req.params.location;

  WeatherData.deleteMany({location: location}, function (err) {
    res.status(204).send(location);
  });
}

export async function handleLocationsReq(req, res) {

  WeatherData.find().distinct("location", function (err, ids) {
    // ids is an array of all ObjectIds
    res.status(200).send(ids);
  });
}

export async function handleNewReq(req, res) {

  const data = req.body;

  const new_data = {
    temperature: data.t,
    rainfall: data.r,
    wind_speed: data.w,
    location: data.l,
    date: data.d,
  };

  WeatherData.update(
    { location: data.l, date: data.d },
    new_data,
    { upsert: true },
    (err, obj) => {
      res.status(200).send(new_data);
    }
  );
}
