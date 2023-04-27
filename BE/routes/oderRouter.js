const router = require("express").Router();
const oderController = require("../controllers/ordersController");

router.post("/create",oderController.createOrder);

module.exports = router;