const router = require("express").Router();
const oderController = require("../controllers/ordersController");

//user
router.post("/create",oderController.createOrder); //ok
router.get("",oderController.getOrders); //ok

//admin

module.exports = router;