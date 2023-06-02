const router = require("express").Router();
const userController = require("../controllers/userController")

router.post("/register",userController.register);
router.post("/login",userController.login);

//user
router.put("/user/changepassword/",userController.changePassword);
router.put("/user/update/", userController.updateUser);
router.get("/user",userController.getUser);
router.post("/user/forgetPassword",userController.forgotPassword);
router.put("/user/resetPassword",userController.resetPassword);

//admin
router.get("",userController.getAllUsers);
router.get("/:id",userController.getUserWhenAdmin);
router.put("/edit/:id",userController.editUser);
router.delete("/delete/:id", userController.deleteUser);
router.put("/user/changeAdminPassword/",userController.changeAdminPassword);

module.exports = router;