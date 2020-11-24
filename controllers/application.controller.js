
const db = require("../models");
const Banner = db.banner;

const { body } = require("express-validator");

const apiResponse = require("../helpers/apiResponse");

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

exports.newBanner = [
	function (req, res) { 
		try {
			const banner = new Banner({
				name: req.body.name,
				image: req.body.image,
				deatails: req.body.deatails,
				description: req.body.description,
				date: req.body.created_date,
				valid_date: req.body.valid_date,
				valid_days: req.body.valid_days,
			});
			banner.save(function (err) { 
				if (err) { return apiResponse.ErrorResponse(res, err); }
				return apiResponse.successResponseWithData(res, "Banner added Successfully.", banner);
			});

		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
exports.getBanner = [
	function (req, res) { 
		try {
			Banner.find({ _id: req.params.id }).then((banner) => {
				if (banner !== null) {
					return apiResponse.successResponseWithData(res, "success", banner);
				} else {
					return apiResponse.successResponseWithData(res, "no banner available", false);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}

	}
];
