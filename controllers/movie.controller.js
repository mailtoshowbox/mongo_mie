
const db = require("../models");
const Movie = db.movie;
const Language = db.languages;
const Genre = db.genres;
const Subscription = db.subscription;

const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Movie Schema
function MovieData(data) {
 
	return true;
	this.id = data._id;
	this.title = data.title;
	this.description = data.description;
	this.isbn = data.isbn;
	this.createdAt = data.createdAt;
}



exports.movieAdd = [
	body("name").isLength({ min: 1 }).trim().withMessage("Email must be specified."),
	function (req, res) {

		try {

			const movie = new Movie({
				name: req.body.name,
				category: req.body.category,
				// genre: req.body.genre,
				language: req.body.language,
				description: req.body.description,
				rate: req.body.rate,
				gst: req.body.gst,
				timing: req.body.timing,
				year: req.body.username,
				adult_only: req.body.username,
				//avalable_in_language: req.body.avalable_in_language,
				trailer: req.body.trailer,
				released_on: req.body.released_on,
				uploaded_on: req.body.uploaded_on,
				copyright_txt: req.body.copyright_txt,
				banners: req.body.banners,
				actress: req.body.actress,
			});

			if (req.body.genres) {
				Genre.find(
					{
						name: { $in: req.body.genres }
					},
					(err, genres) => {
						if (err) {
							return apiResponse.ErrorResponse(res, err);
						} 
						movie.genres = genres.map(genre => genre._id);
					}
				);
			}
			if (req.body.available_languages) {
				Language.find(
					{
						name: { $in: req.body.available_languages }
					},
					(err, languages) => {
						if (err) {
							return apiResponse.ErrorResponse(res, err);
						}
						movie.available_languages = languages.map(language => language._id);
					}
				);
			}
			movie.save(function (err) {
				if (err) { return apiResponse.ErrorResponse(res, err); }

				return apiResponse.successResponseWithData(res, "movie added Success.", movie);
			}).catch(err => {
				return apiResponse.ErrorResponse(res, err);
			});

		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Movie List.
 * 
 * @returns {Object}
 */
exports.movieList = [
	body("name").isLength({ min: 1 }).trim().withMessage("Email must be specified."),
	function (req, res) {
		try {
			const { type = 0, userid = "" } = req.params;
			switch (type) {
				case "0":

					Movie.find({}).then((movies) => {
						if (movies !== null) {
							return apiResponse.successResponseWithData(res, "success, all movies", movies);
						} else {
							return apiResponse.successResponseWithData(res, "Not purchased yet", false);
						}
					});
					break;
				case "1": // "upcomming":  
					Movie.find({ uploaded_on: null }).then((movies) => {
						if (movies !== null) {
							return apiResponse.successResponseWithData(res, "success, upcomming movies", movies);
						} else {
							return apiResponse.successResponseWithData(res, "Not purchased yet", false);
						}
					});
					break;
				case "2": //"watch": 
					Subscription.find({ user: userid }
						, "movie")
						.then((purchasedMovies) => {
							var purchasedMovieList = Object.keys(purchasedMovies).map((key) => purchasedMovies[key]["movie"]);
							Movie.find(
								{
									_id: { $in: purchasedMovieList }
								},
								(err, movies) => {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									}
								}
							).then((data) => {
								if (data.length > 0) {
									return apiResponse.successResponseWithData(res, "success, watched movies", data);
								} else {
									return apiResponse.successResponseWithData(res, "Not purchased yet", false);
								}
							});
						});
					break;
				default:
					Movie.find({}, function (err, movies) {
						if (err) return res.status(500).send("There was a problem finding the users.");
						res.status(200).send(movies);
					});
					break;
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];







/**
 * Movie Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.movieDetail = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Movie.findOne({ _id: req.params.id, user: req.user._id }, "_id title description isbn createdAt").then((movie) => {
				if (movie !== null) {
					let movieData = new {};
					return apiResponse.successResponseWithData(res, "Operation success", movieData);
				} else {
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];



/**
 * Movie Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.movieDelete = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Movie.findById(req.params.id, function (err, foundMovie) {
				if (foundMovie === null) {
					return apiResponse.notFoundResponse(res, "Movie not exists with this id");
				} else {
					//Check authorized user
					if (foundMovie.user.toString() !== req.user._id) {
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					} else {
						//delete Movie.
						Movie.findByIdAndRemove(req.params.id, function (err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							} else {
								return apiResponse.successResponse(res, "Movie Removed.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


function SubscriptionInfo(data) {
	const  {
		_id,
		user,
		cardNumber = null,
		mobilenumber,
		payment_method,
		plan,
		date,
		amount,
		device,subscribe_valid_date, subscribe_valid_days,
		movie} = data;
	 const res = {	
		 
		 "subscribe_status" : _id ? 1 : 0,
		 "subscribe_Id" : _id,
		 "subscribe_plan" : plan, 
		 "subscribe_method" : payment_method,
		 "subscribe_amount" : amount,
		 "subscribe_date" : date, 
		 "subscribe_valid_date" :  subscribe_valid_date,
		 "subscribe_valid_days" : subscribe_valid_days
	 }
	 return res;

}

/**
 * Movie Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.watchMovie = [
	function (req, res) {
		try {
			const checkUserSubcription = { user: req.body.user_id, movie: req.body.movieId }
			Subscription.findOne(checkUserSubcription).then((subscriptionDetails) => {
				if (subscriptionDetails !== null) {
					return apiResponse.successResponseWithData(res, "success", SubscriptionInfo(subscriptionDetails));
				} else {
					return apiResponse.successResponseWithData(res, "Not purchased yet", false);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}

	}

];