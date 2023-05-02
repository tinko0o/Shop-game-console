const router = require("express").Router();
const ratingController = require("../controllers/ratingController");

//user
router.post("/add",ratingController.addRating);


//admin

module.exports = router;