const UserModel = require("../models/UserModel");
var mongoose = require("mongoose");

const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");
const { authenticate, getToken } = require("../middlewares/jwt");

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
	// Validate fields.
	/* 	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
			.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
		body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
			.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."), */
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address.").custom((value) => {
			return UserModel.findOne({ email: value }).then((user) => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	// Sanitize fields.
	sanitizeBody("firstName").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				//hash input password
				bcrypt.hash(req.body.password, 10, function (err, hash) {
					// generate OTP for confirmation
					let otp = utility.randomNumber(4);
					// Create User object with escaped and trimmed data
					var user = new UserModel(
						{
							firstName: req.body.firstName,
							lastName: req.body.lastName,
							email: req.body.email,
							password: hash,
							confirmOTP: otp,
							mobilenumber: req.body.mobilenumber,
							device_id: req.body.device_id,
							status: true
						}
					);
					// Html email body
					//let html = "<p>Please Confirm your Account.</p><p>OTP: " + otp + "</p>";
					// Send confirmation email
					/* mailer.send(
						constants.confirmEmails.from,
						req.body.email,
						"Confirm Account",
						html
					).then(function () { */
					// Save user.
					user.save(function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
						let userData = {
							_id: user._id,
							firstName: user.firstName,
							lastName: user.lastName,
							email: user.email
						};
						return apiResponse.successResponseWithData(res, "Registration Success.", userData);
					});
					/* }).catch(err => {
						console.log(err);
						return apiResponse.ErrorResponse(res, err);
					}); */
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	(req, res) => { 
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				UserModel.findOne({ email: req.body.email }).then(user => {
					if (user) {
						//Compare given password with db's hash.
						bcrypt.compare(req.body.password, user.password, function (err, same) {
							if (same) {
								//Check account confirmation.
								//if (user.isConfirmed) {
								// Check User's account active or not.
								if (user.status) {
									let userData = {
										_id: user._id,
										firstName: user.firstName,
										lastName: user.lastName,
										email: user.email,

									};
									//Prepare JWT token for authentication
									userData.token = getToken({ email: user.email })
									return apiResponse.successResponseWithData(res, "Login Success.", userData);
								} else {
									return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
								}
								/* } else {
									return apiResponse.unauthorizedResponse(res, "Account is not confirmed. Please confirm your account.");
								} */
							} else {
								return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
							}
						});
					} else {
						return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * Verify Confirm otp.
 *
 * @param {string}      email
 * @param {string}      otp
 *
 * @returns {Object}
 */
exports.verifyConfirm = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("otp").isLength({ min: 1 }).trim().withMessage("OTP must be specified."),
	sanitizeBody("email").escape(),
	sanitizeBody("otp").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				var query = { email: req.body.email };
				UserModel.findOne(query).then(user => {
					if (user) {
						//Check already confirm or not.
						if (!user.isConfirmed) {
							//Check account confirmation.
							if (user.confirmOTP == req.body.otp) {
								//Update user as confirmed
								UserModel.findOneAndUpdate(query, {
									isConfirmed: 1,
									confirmOTP: null
								}).catch(err => {
									return apiResponse.ErrorResponse(res, err);
								});
								return apiResponse.successResponse(res, "Account confirmed success.");
							} else {
								return apiResponse.unauthorizedResponse(res, "Otp does not match");
							}
						} else {
							return apiResponse.unauthorizedResponse(res, "Account already confirmed.");
						}
					} else {
						return apiResponse.unauthorizedResponse(res, "Specified email not found.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

/**
 * Resend Confirm otp.
 *
 * @param {string}      email
 *
 * @returns {Object}
 */
exports.resendConfirmOtp = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	sanitizeBody("email").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			} else {
				var query = { email: req.body.email };
				UserModel.findOne(query).then(user => {
					if (user) {
						//Check already confirm or not.
						if (!user.isConfirmed) {
							// Generate otp
							let otp = utility.randomNumber(4);
							// Html email body
							let html = "<p>Please Confirm your Account.</p><p>OTP: " + otp + "</p>";
							// Send confirmation email
							mailer.send(
								constants.confirmEmails.from,
								req.body.email,
								"Confirm Account",
								html
							).then(function () {
								user.isConfirmed = 0;
								user.confirmOTP = otp;
								// Save user.
								user.save(function (err) {
									if (err) { return apiResponse.ErrorResponse(res, err); }
									return apiResponse.successResponse(res, "Confirm otp sent.");
								});
							});
						} else {
							return apiResponse.unauthorizedResponse(res, "Account already confirmed.");
						}
					} else {
						return apiResponse.unauthorizedResponse(res, "Specified email not found.");
					}
				});
			}
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];



exports.update = [
	body("device_id", "device_id must not be empty.").isLength({ min: 1 }).trim(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var user = new UserModel(
				{

					email: req.body.email_id,
					userimage: req.body.userimage,
					location: req.body.location,
					token: req.body.token,
					mobilenumber: req.body.mobilenumber,
					device_id: req.body.device_id,
					_id: req.params.id
				});
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				} else {
					UserModel.findById(req.params.id, function (err, foundUser) {
						if (foundUser === null) {
							return apiResponse.notFoundResponse(res, "User not exists with this id");
						} else {
							//Check authorized user
							if (req.params.id.toString() !== foundUser._id.toString()) {
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							} else {
								//update User.
								UserModel.findByIdAndUpdate(req.params.id, user, {}, function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									} else {
										return apiResponse.successResponseWithData(res, "User update Success.", foundUser);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.view = [
	authenticate,
	(req, res) => {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid User");
		}
		try {
			UserModel.findOne({ _id: req.params.id },
				"type userimage username mobilenumber email otp_verification otp device_id token subscribe_valid_date subscribe_valid_days Share_status"
			).then((profile) => {
				if (profile !== null) {
					return apiResponse.successResponseWithData(res, "success", profile);
				} else {
					return apiResponse.successResponseWithData(res, " success , but no profile info", {});
				}
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.changePassword = [
	body("old_password", "old password must not be empty.").isLength({ min: 1 }).trim(),
	body("new_password", "new password must not be empty.").isLength({ min: 1 }).trim(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var user = new UserModel(
				{
					password: req.body.new_password,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				} else {

					UserModel.findById(req.params.id, function (err, profile) {
						if (profile) {
							//Compare given password with db's hash.
							bcrypt.compare(req.body.old_password, profile.password, function (err, same) {
								if (same) {
									// Check User's account active or not.
									if (profile.status) {
										bcrypt.hash(req.body.new_password, 10, function (err, hash) {
											var userNew = new UserModel(
												{
													password: hash,
													_id: req.params.id
												}
											);
											UserModel.findByIdAndUpdate(req.params.id, userNew, {}, function (err) {
												if (err) {
													return apiResponse.ErrorResponse(res, err);
												} else {
													return apiResponse.successResponseWithData(res, "Password Change Success.", {});
												}
											});
										});
									}
								} else {
									return apiResponse.unauthorizedResponse(res, " Old password is wrong");
								}
							});
						} else {
							return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.forgetPassword = [

	(req, res) => {
		try {
			const errors = validationResult(req);
			var user = new UserModel(
				{
					password: req.body.new_password,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				} else {

					UserModel.findById(req.params.id, function (err, profile) {
						if (profile) {
							//Compare given password with db's hash.
							bcrypt.compare(req.body.old_password, profile.password, function (err, same) {
								if (same) {
									// Check User's account active or not.
									if (profile.status) {
										bcrypt.hash(req.body.new_password, 10, function (err, hash) {
											var userNew = new UserModel(
												{
													password: hash,
													_id: req.params.id
												}
											);
											UserModel.findByIdAndUpdate(req.params.id, userNew, {}, function (err) {
												if (err) {
													return apiResponse.ErrorResponse(res, err);
												} else {
													return apiResponse.successResponseWithData(res, "Password Change Success.", {});
												}
											});
										});
									}
								} else {
									return apiResponse.unauthorizedResponse(res, " Old password is wrong");
								}
							});
						} else {
							return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];