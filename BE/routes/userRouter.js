const router = require("express").Router();
const userController = require("../controllers/userController")

router.post("/register",userController.register);
router.post("/login",userController.login);
router.put("/:id", userController.updateUser);
router.get("/:id",userController.showInformation);

module.exports = router;