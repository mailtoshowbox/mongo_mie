var express = require("express");
const MovieController = require("../controllers/movie.controller");

var router = express.Router();

router.post("/new", MovieController.movieAdd);
router.get("/list/:type", MovieController.movieList);
router.get("/list/:type/:userid", MovieController.movieList);
router.get("/watchNow", MovieController.watchMovie);




module.exports = router;