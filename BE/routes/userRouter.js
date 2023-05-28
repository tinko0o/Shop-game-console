const router = require("express").Router();
const userController = require("../controllers/userController")

router.post("/register",userController.register); //ok
router.post("/login",userController.login); //ok

//user
router.put("/user/changepassword/",userController.changePassword); //ok
router.put("/user/update/", userController.updateUser); //ok
router.get("/user",userController.getUser); //ok

//admin
router.get("",userController.getAllUsers);
router.get("/:id",userController.getUserWhenAdmin);
router.put("/edit/:id",userController.editUser);
router.delete("/delete/:id", userController.deleteUser);
router.put("/user/changeAdminPassword/",userController.changeAdminPassword);

module.exports = router;