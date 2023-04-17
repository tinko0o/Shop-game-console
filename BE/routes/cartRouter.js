const router = require("express").Router();
const cartController = require("../controllers/cartsController");

router.post("/",cartController.addCart);
router.get("/",cartController.getUserCart);
router.put("/:id",cartController.updateCart);

module.exports = router;