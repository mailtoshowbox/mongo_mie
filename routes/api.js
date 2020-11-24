var express = require("express");
var authRouter = require("./auth");
var movieRouter = require("./movie");
var subscriptionRouter = require("./subscription");
var commonRouter = require("./application");

var app = express();


app.use("/auth/", authRouter);
app.use("/movie/", movieRouter);
app.use("/purchase/", subscriptionRouter);
app.use("/common/", commonRouter);


module.exports = app; 