const User = require("../models/userModel");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const Comment = require("../models/commentModel");

// add comment
exports.addComment = async (req, res) => {
    try {
      const token = req.headers.authentication;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      const key = process.env.JWT_SEC;
      const decoded = jwt.verify(token, key);
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found or invalid token',
        });
      }
      const product = await Product.findById(req.body.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      if (!req.body.comment) {
        return res.status(400).json({
          success: false,
          message: 'Comment cannot be empty',
        });
      }
      const parentCommentId = req.body.parentCommentId || null;
      let repliedToUsername = null;
      if (parentCommentId !== null) {
        const parentComment = await Comment.findById(parentCommentId);
        if (parentComment) {
          repliedToUsername = parentComment.name;
          if (parentComment.userId.toString() === user.id.toString()) {
            // exclude @username mention for comments made by the same user
            repliedToUsername = null;
          }
        }
      }
      const newComment = new Comment({
        productId: req.body.productId,
        userId: user.id,
        name: user.name,
        email: user.email,
        comment: req.body.comment,
        parentCommentId: parentCommentId,
        repliedToUsername: repliedToUsername,
      });
      await newComment.save();
      return res.status(200).json({
        success: true,
        message: 'Comment added successfully',
        data: newComment,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.',
      });
    }
  };

  //get product comments

  exports.getComments = async (req, res) => {
    try {
      const productId = req.params.productId;
  
      const comments = await Comment.find({ productId: productId });
  
      const replies = await Comment.find({ productId: productId, parentCommentId: { $ne: null } });
  
      const commentsWithReplies = comments.map(comment => {
        const commentData = comment.toObject();
        commentData.replies = replies.filter(reply => String(reply.parentCommentId) === String(comment._id));
        return commentData;
      });
  
      res.status(200).json({
        success: true,
        comments: commentsWithReplies,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  };



