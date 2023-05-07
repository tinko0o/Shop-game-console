const User = require("../models/userModel");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const Comment = require("../models/commentModel");
const Order = require("../models/orderModel");

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
    const orders = await Order.find({ userId: user.id });
    if (!orders) {
      return res.status(400).json({
        success: false,
        message: "orders not found",
      });
    }
    const parentCommentId = req.body.parentCommentId || null;
    let repliedToUsername = null;
    if (parentCommentId !== null) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found',
        });
      }
      repliedToUsername = parentComment.name;
      if (parentComment.userId.toString() === user.id.toString()) {
        // exclude @username mention for comments made by the same user
        repliedToUsername = null;
      }
    }
    const isAdmin = user.isAdmin;
    const isProductInOrder = orders.some(order => order.products.some(product => product.id.toString() === req.body.productId.toString()));
    if (!isProductInOrder) {
      const newComment = new Comment({
        productId: req.body.productId,
        userId: user.id,
        name: user.name,
        email: user.email,
        comment: req.body.comment,
        parentCommentId: parentCommentId,
        repliedToUsername: repliedToUsername,
        isAdmin: isAdmin,
      });
      await newComment.save();
      return res.status(200).json({
        success: true,
        message: 'Comment added successfully',
        data: newComment,
      });
    }
    else {
      const newComment = new Comment({
        productId: req.body.productId,
        userId: user.id,
        name: user.name,
        email: user.email,
        comment: req.body.comment,
        parentCommentId: parentCommentId,
        repliedToUsername: repliedToUsername,
        isAdmin: isAdmin,
        purchased: true,
      });
      await newComment.save();
      return res.status(200).json({
        success: true,
        message: 'Comment added successfully',
        data: newComment,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};


//delete product comments 1

exports.deleteComment = async (req, res) => {
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
    if (!user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }
    if (comment.userId.toString() !== user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment',
      });
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
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
    const commentsWithReplies = comments
      .filter(comment => !comment.parentCommentId) // Only include main comments.
      .map(comment => {
        const commentData = comment.toObject();
        commentData.replies = replies.filter(reply => String(reply.parentCommentId) === String(comment._id));
        return commentData;
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Sort in descending order by default.
    const mainComments = comments.filter(comment => !comment.parentCommentId);
    const replyCount = replies.length;
    const mainCommentCount = mainComments.length;
    let totalCommentCount = mainCommentCount;
    for (let i = 0; i < mainCommentCount; i++) {
      const comment = mainComments[i];
      const matchingReplies = replies.filter(reply => String(reply.parentCommentId) === String(comment._id));
      totalCommentCount += matchingReplies.length;
    }
    res.status(200).json({
      success: true,
      comments: commentsWithReplies,
      total: totalCommentCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};







