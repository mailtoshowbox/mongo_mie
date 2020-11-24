var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String, required: true },
	mobilenumber: { type: String, required: true },
	device_id: { type: String, required: true },
	password: { type: String, required: true },
	isConfirmed: { type: Boolean, required: true, default: 0 },
	confirmOTP: { type: String, required: false },
	otpTries: { type: Number, required: false, default: 0 },
	status: { type: Boolean, required: true, default: 1 }
}, { timestamps: true });

// Virtual for user's full name
UserSchema
	.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

module.exports = mongoose.model("User", UserSchema);