const mongoose = require("mongoose");

import { WeatherData } from "./models.js";

export async function handleAddReq(req, res) {

  const location = req.body.location;
  const data = req.body.data;
  let results;

  try {
    results = await WeatherData.deleteMany({location: location});
  } catch(error) {
    console.log(error);
    res.status(500).send();
    return;
  }

  let dataWithLocation = data.map( obj => ( {...obj, location: location}) );

  try {
    results = await WeatherData.insertMany(dataWithLocation);
  } catch(error) {
    console.log(error);
    res.status(500).send();
    return;
  }

  res.status(200).send("");
}


export async function handleDataReq(req, res) {

  let location = req.params.location;
  let results;

  try {
    results =
    await WeatherData.find({ location:location, date: { $ne: null } })
          .select(['-_id','temperature','rainfall','wind_speed','date'])
          .exec();
  } catch(error) {
    console.log(error);
    res.status(500).send();
    return;
  }

  res.status(200).send(results);
}

export async function handleRemoveReq(req, res) {

  let location = req.params.location;

  try {
    await WeatherData.deleteMany({location: location});
  } catch(error) {
    console.log(error);
    res.status(500).send();
    return;
  }

  res.status(204).send(location);
}

export async function handleLocationsReq(req, res) {

  let results;

  try {
    results = await WeatherData.find().distinct("location");
  } catch(error) {
    console.log(error);
    res.status(500).send();
    return;
  }

  res.status(200).send(results);
}

export async function handleNewReq(req, res) {

  const data = req.body;

  const new_data = {
    location: data.location,
  };

  let results;

  try {
    results = await WeatherData.update(
      { location: data.l },
      new_data,
      { upsert: true });
  } catch(error) {
    console.log(error);
    res.status(500).send();
    return;
  }

  res.status(200).send(new_data);
}
