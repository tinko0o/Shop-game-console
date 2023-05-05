const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    productId: { type: String, require: true },
    userId: { type: String, require: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    comment: { type: String, require: true },
    parentCommentId: { type: String, default: null },
    repliedToUsername: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: "comments",
  }
);

module.exports = mongoose.model("Comment", CommentSchema);