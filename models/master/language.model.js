const mongoose = require("mongoose");

const Language = mongoose.model(
  "Languages",
  new mongoose.Schema({
    name: String
  })
);

module.exports = Language;
