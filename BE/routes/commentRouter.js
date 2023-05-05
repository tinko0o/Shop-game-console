const router = require("express").Router();
const CommentController = require("../controllers/commentController");

//user
router.post("/add",CommentController.addComment);
router.get("/:productId",CommentController.getComments);

//admin

module.exports = router;