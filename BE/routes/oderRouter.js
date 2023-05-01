const router = require("express").Router();
const oderController = require("../controllers/ordersController");

//user
router.post("/create",oderController.createOrder);
router.get("",oderController.getOrders);

//admin

module.exports = router;