"use strict";
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config({ path: path.resolve(__dirname + "/.env") });

const connection = require("./config/db.config");
connection.connect();

var quoteRouter = require("./routes/quote.route");

var app = express();
const appName = process.env.APP_NAME || "quotes-app";
const port = process.env.PORT || 9000;
const ipaddress = process.env.IP || "127.0.0.1";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "assets")));

app.use("/api/quotes", quoteRouter);

const cronService = require("./services/cron.service");

const server = app.listen(port, ipaddress, () => {
  console.log(`Server for ${appName} started on ${ipaddress}:${port}`);
});

app.get("/", (req, res) => {
  res.send("status ok");
});

app.get("/policies/privacy", (req, res) => {
  res.sendFile("/root/kaunaj/quotes-app/assets/policies/privacy.html");
});
