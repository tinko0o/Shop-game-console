const router = require("express").Router();
const productController = require("../controllers/productsController")

router.get("/:id",productController.getProduct);
router.get("",productController.getAllProducts);
router.get("/searchedProducts/search",productController.searchProducts);

//user



//admin
router.post("/add",productController.addProduct);
router.put("/update/:id",productController.updateProduct);
router.delete("/delete/:id",productController.deleteProduct);


module.exports = router;