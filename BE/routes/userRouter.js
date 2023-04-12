const router = require("express").Router();
const userController = require("../controllers/userController")

router.post("/register",userController.register);
router.post("/login",userController.login);
router.put("/changepassword/:id",userController.changePassword);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);
router.get("/",userController.getAllUsers);
router.get("/find/:id",userController.getUser);

module.exports = router;