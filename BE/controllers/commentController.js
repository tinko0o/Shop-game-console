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
        message: "Không được phép",
      });
    }
    const key = process.env.JWT_SEC;
    const decoded = jwt.verify(token, key);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }
    const orders = await Order.find({ userId: user.id });
    if (!orders) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy order",
      });
    }

    let parentCommentId = null;
    let repliedToUsername = null;

    if (req.body.parentCommentId !== undefined) {
      const parentComment = await Comment.findById(req.body.parentCommentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy bình luận",
        });
      }

      if (parentComment.parentCommentId === null) {
        parentCommentId = parentComment._id;
      } else {
        parentCommentId = parentComment.parentCommentId;
      }

      if (parentComment.userId.toString() !== user.id.toString()) {
        repliedToUsername = parentComment.name;
      }
    }

    const isAdmin = user.isAdmin;
    const isProductInOrder = orders.some(order => order.products.some(product => product.id.toString() === req.body.productId.toString()));
    const newComment = new Comment({
      productId: req.body.productId,
      userId: user.id,
      name: user.name,
      email: user.email,
      comment: req.body.comment,
      parentCommentId: parentCommentId,
      repliedToUsername: repliedToUsername,
      isAdmin: isAdmin,
      purchased: isProductInOrder,
    });
    await newComment.save();
    return res.status(200).json({
      success: true,
      message: "Bình luận thành công",
      data: newComment,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra sự cố vui lòng thử lại sau",
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
        message: "Không được phép",
      });
    }
    const key = process.env.JWT_SEC;
    const decoded = jwt.verify(token, key);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }
    if (!user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: "bạn không có quyền",
      });
    }
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bình luận",
      });
    }
    // if (comment.userId.toString() !== user.id.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Bạn không có quyền xóa bình luận này",
    //   });
    // }
    await Comment.findByIdAndDelete(req.params.commentId);
    return res.status(200).json({
      success: true,
      message: "Xóa bình luận thành công",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra sự cố vui lòng thử lại sau",
    });
  }
};

//get product comments

exports.getComments = async (req, res) => {
  try {
    const productId = req.params.productId;
    const comments = await Comment.find({ productId: productId, parentCommentId: null }).sort({ createdAt: -1 });
    const commentsWithReplies = [];

    for (const comment of comments) {
      const commentData = comment.toObject();
      const replies = await Comment.find({ parentCommentId: comment._id }).sort({ createdAt: 1 });
      commentData.replies = [];

      for (const reply of replies) {
        const replyData = reply.toObject();
        commentData.replies.push(replyData);
      }
      commentsWithReplies.push(commentData);
    }

    res.status(200).json({
      success: true,
      comments: commentsWithReplies,
      total: comments.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra sự cố vui lòng thử lại sau",
    });
  }
};
