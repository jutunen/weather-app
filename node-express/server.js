const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();

const mongoose = require("mongoose");

import {
  getLocations,
  getLocationData,
  addLocation,
  saveAll,
  deleteLocation
 } from "./functions.js";

async function connectMongoose() {
    await mongoose.connect("mongodb://user_1:user_1@localhost/banking-mongoose", {
    //await mongoose.connect("mongodb://user_1:user_1@localhost/banking", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

connectMongoose();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use((req, res, next) => setTimeout(next, 500));

app.get("/location/all", (req, res) => {
    getLocations(req, res);
});

app.get("/data/:location", (req, res) => {
    getLocationData(req, res);
});

app.post("/location/new", (req, res) => {
    addLocation(req, res);
});

app.post("/data/save", (req, res) => {
    saveAll(req, res);
});

app.delete("/location/:location", (req, res) => {
    deleteLocation(req, res);
});

console.log("Listening port 5100");
app.listen(5100);
