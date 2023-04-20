const router = require("express").Router();
const cartController = require("../controllers/cartsController");

router.post("/add",cartController.addCart);
router.get("/get",cartController.getUserCart);
router.put("/update/:id",cartController.updateCart);
router.get("/amount",cartController.getAmountCart);

module.exports = router;