const router = require("express").Router();
const cartController = require("../controllers/cartsController");


router.post("/",cartController.addCart);

module.exports = router;