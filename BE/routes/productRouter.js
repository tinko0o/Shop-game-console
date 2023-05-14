const router = require("express").Router();
const productController = require("../controllers/productsController")

router.get("",productController.getAllProducts);
router.post("/search",productController.searchProducts);
router.get("/:id",productController.getProduct);

//user



//admin
router.post("/add",productController.addProduct);
router.put("/update/:id",productController.updateProduct);
router.delete("/delete/:id",productController.deleteProduct);
router.get("/abc/top-sales-products",productController.getTopSalesProducts);


module.exports = router;