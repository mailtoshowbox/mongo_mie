const mongoose = require("mongoose");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({

    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    language: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    rate: String,
    gst: String,
    timing: String,
    year: String,
    adult_only: Boolean,
    available_languages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language"
      }
    ],
    trailer: {
      url: String
    },
    released_on: { type: Date, default: Date.now },
    uploaded_on: { type: Date, default: Date.now },
    copyright_txt: String,
    banners: {
      movie_banner_image: String,
      movie_banner_sub_image_1: String,
      movie_banner_sub_image_2: String,
      movie_banner_sub_image_3: String,
      movie_banner_sub_image_4: String
    },
    actress: [
      {
        name: { type: String, default: 'My actress' },
        image: { type: String, default: '' },

      }
    ]


  })
);

module.exports = Movie;
