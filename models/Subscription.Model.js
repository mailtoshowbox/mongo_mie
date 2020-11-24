

const mongoose = require("mongoose");

const Subscription = mongoose.model(
	"Subscription",
	new mongoose.Schema({
		user: { type: String },
		mobilenumber: { type: String },
		payment_method: { type: String },
		plan: { type: String },
		date: { type: Date, default: Date.now },
		amount: { type: String },
		device: { type: String },
		movie: { type: String },
		cardNumber: { type: String },
		subscribe_date: { type: Date, default: Date.now },
		subscribe_valid_date: { type: Date, default: Date.now },
		subscribe_valid_days: { type: Number } 
	})
);

module.exports = Subscription;