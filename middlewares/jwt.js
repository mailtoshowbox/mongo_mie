const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken")

const apiResponse = require("../helpers/apiResponse");


const authenticate = (req, res, next) => {
	// We can obtain the session token from the requests cookies, which come with every request
	const token = req.cookies.token
	// if the cookie is not set, return an unauthorized error
	if (!token) {
		return res.status(401).end()
	}
	var payload
	try {
		jwt.verify(token, secret);
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			if (e.name === "TokenExpiredError") {
				return apiResponse.successResponseWithData(res.status(400), "User session logged out", {});
			}
			return apiResponse.successResponseWithData(res.status(401), "unknown", {});
		}
	}
	next();
}

const getToken = (jwtPayload) => {
	const expirationSeconds = 60 * 10; // half minute
	const token = jwt.sign({
		exp: Math.floor(Date.now() / 1000) + (expirationSeconds),
		jwtPayload,
		algorithm: "HS256",
	}, secret);
	return token;
}

module.exports = { authenticate, getToken };