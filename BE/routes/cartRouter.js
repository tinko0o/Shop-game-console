const router = require("express").Router();
const cartController = require("../controllers/cartsController");

//user
router.post("/add",cartController.addCart);
router.put("/cart/update/:id",cartController.updateCart);
router.get("/cart",cartController.getCart);
router.get("/cart/amount",cartController.getAmountCart);
router.delete("/cart/delete/:id",cartController.deleteCartProducts);
router.delete("/cart/delete",cartController.deleteCart);

//admin

module.exports = router;