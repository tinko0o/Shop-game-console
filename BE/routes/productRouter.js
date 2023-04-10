const router = require("express").Router();

const productController = require("../controllers/productsController");

router.post("/product", productController.addProduct);
module.exports = router;