const router = require("express").Router();
const userController = require("../controllers/userController")

router.post("/register",userController.register);
router.post("/login",userController.login);

//user
router.put("/user/changepassword/",userController.changePassword);
router.put("/user/update/", userController.updateUser);
router.get("/user",userController.getUser);

//admin
router.get("",userController.getAllUsers);
router.get("/:id",userController.getUserWhenAdmin);
router.get("/edit/:id",userController.editUser);
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;