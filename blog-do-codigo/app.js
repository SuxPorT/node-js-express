const express = require("express");
const passport = require("passport");
const app = express();

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

module.exports = app;
