const router = require("express").Router();
const oderController = require("../controllers/ordersController");

//user
router.post("/create",oderController.createOrder); //ok
router.post("/create/Momo",oderController.createOrderWithMomo); //ok
router.get("",oderController.getOrders); //ok
router.put("/cancel/:id",oderController.cancelOrderUser);

//admin
router.get("/all-orders",oderController.getAllOrders);
router.put("/confirm/:id",oderController.confirmOrder);
router.put("/confirm/delivery/:id",oderController.deliveryOrder);
router.put("/peding/confirm/cancel/:id",oderController.cancelOrderAdmin);


module.exports = router;