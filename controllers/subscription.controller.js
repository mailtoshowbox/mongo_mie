
const db = require("../models");
const Subscription = db.subscription;


const { body } = require("express-validator");

const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Book Schema
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
		 
		 "subscribe_Id" : _id,
		 "subscribe_plan" : plan, 
		 "subscribe_method" : payment_method,
		 "subscribe_cardNumber" : cardNumber,
		 "subscribe_amount" : amount,
		 "subscribe_date" : date, 
		 "subscribe_valid_date" :  subscribe_valid_date,
		 "subscribe_valid_days" : subscribe_valid_days
	 }
	 return res;

}
exports.newSubcription = [
	function (req, res) {
		try {
				const {subscribe_by_method = 'paymentgate',  } = req.body;
                const subscribe_date = new Date(req.body.subscribe_date);

				let purchase = {};
				
				
				if(subscribe_by_method === 'paymentgate'){ 
					purchase = 	new Subscription({
						user: req.body.user_id,
						mobilenumber: req.body.mobilenumber,
						// genre: req.body.genre,
						payment_method:  subscribe_by_method,
						plan: req.body.subscribe_by_plan,
						date: req.body.subscribe_date,
						amount: req.body.subscribe_amount,
						device: req.body.device_id,
						movie: req.body.movieId,
						"subscribe_valid_date" :  new Date(subscribe_date.getFullYear() + 1, subscribe_date.getMonth(), subscribe_date.getDate()), 
		 "subscribe_valid_days" : 365
					});

				}else if(subscribe_by_method === 'cardRecharge') { 
					purchase = 	new Subscription({
						user: req.body.user_id,
						mobilenumber: req.body.mobilenumber,
						// genre: req.body.genre,
						cardNumber : req.body.cardNumber,
						payment_method: subscribe_by_method,
						plan: req.body.subscribe_by_plan,
						date: req.body.subscribe_date,
						amount: req.body.subscribe_amount,
						device: req.body.device_id,
						movie: req.body.movieId,
						subscribe_date : subscribe_date, 
						"subscribe_valid_date" :  new Date(subscribe_date.getFullYear() + 1, subscribe_date.getMonth(), subscribe_date.getDate()), 
		 				"subscribe_valid_days" : 365
					});
				}


			
			purchase.save(function (err) {
				if (err) { return apiResponse.ErrorResponse(res, err); } 
				return apiResponse.successResponseWithData(res, "Subcribe applied successfully.", SubscriptionInfo(purchase));
			});

		} catch (err) { 
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
exports.checkSubcription = [
	function (req, res) {
		try {
			const checkUserSubcription = { user: req.body.user_id, movie: req.body.movieId }
			Subscription.findOne(checkUserSubcription).then((subscriptionDetails) => {
				if (subscriptionDetails !== null) {
					return apiResponse.successResponseWithData(res, "success", subscriptionDetails);
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

