const mongoose = require("mongoose");

const Genre = mongoose.model(
  "Genres",
  new mongoose.Schema({
    name: String
  })
);

module.exports = Genre;
