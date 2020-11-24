const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.movie = require("./Movie.Model");
db.subscription = require("./Subscription.Model");
//master
db.genres = require("./master/genre.model");
db.languages = require("./master/language.model");
//Application settings
db.banner = require("./application/banner.model");


module.exports = db;