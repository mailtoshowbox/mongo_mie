const mongoose = require("mongoose");

const Banner = mongoose.model(
  "Banners",
  new mongoose.Schema({
    name: String,
    image:
    {
      data: Buffer,
      contentType: String
    },
    deatails: String,
    description: String,
    date: { type: Date, default: Date.now },
    valid_date: { type: Date, default: Date.now },
    valid_days: String,
  })
);

module.exports = Banner;
