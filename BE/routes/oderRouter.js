const router = require("express").Router();
const oderController = require("../controllers/ordersController");

//user
router.post("/create",oderController.createOrder); //ok
router.get("",oderController.getOrders); //ok

//admin
router.get("/all-orders",oderController.getAllOrders);
router.put("/confirm/:id",oderController.confirmOrder);
router.put("/confirm/delivery/:id",oderController.deliveryOrder);


module.exports = router;