const router = require("express").Router();
const CommentController = require("../controllers/commentController");

//user
router.post("/add",CommentController.addComment);
router.get("/:productId",CommentController.getComments);
router.delete("/:commentId",CommentController.deleteComment);

//admin

module.exports = router;