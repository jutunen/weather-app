const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();

const mongoose = require("mongoose");

import {
  handleNewReq,
  handleLocationsReq,
  handleRemoveReq,
  handleDataReq,
  handleAddReq
 } from "./functions.js";

async function connectMongoose() {
    await mongoose.connect("mongodb://user_1:user_1@localhost/banking", {
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
    handleLocationsReq(req, res);
});

app.get("/data/:location", (req, res) => {
    handleDataReq(req, res);
});

app.post("/location/new", (req, res) => {
    handleNewReq(req, res);
});

app.post("/data/save", (req, res) => {
    handleAddReq(req, res);
});

app.delete("/location/:location", (req, res) => {
    handleRemoveReq(req, res);
});

console.log("Listening port 5000");
app.listen(5000);
