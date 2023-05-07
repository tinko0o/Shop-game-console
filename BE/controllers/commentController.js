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
    const commentsWithReplies = [];

    // First loop to get main comments and replies
    for (const comment of comments) {
      const commentData = comment.toObject();
      const replies = comments.filter(reply => String(reply.parentCommentId) === String(comment._id));
      commentData.replies = [];

      // Second loop to get replies to main comments
      for (const reply of replies) {
        const replyData = reply.toObject();
        const replyReplies = comments.filter(replyReply => String(replyReply.parentCommentId) === String(reply._id));
        replyData.replies = replyReplies.map(replyReply => {
          const replyReplyData = replyReply.toObject();
          return replyReplyData;
        });
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
      message: "Something went wrong. Please try again later.",
    });
  }
};










// i don't want it like this :

// {
//   "success": true,
//   "comments": [
//       {
//           "_id": "64577a321b5b9cf3721576b0",
//           "productId": "64474ff0a238c536a71088b2",
//           "userId": "644726e5c975183b8afa4fc9",
//           "name": "user01",
//           "email": "user01@gmail.com",
//           "comment": "Đây là bình luận cha của user01",
//           "parentCommentId": null,
//           "repliedToUsername": null,
//           "isAdmin": false,
//           "purchased": true,
//           "createdAt": "2023-05-07T10:15:14.748Z",
//           "updatedAt": "2023-05-07T10:15:14.748Z",
//           "__v": 0,
//           "replies": [
//               {
//                   "_id": "64577acf1b5b9cf3721576b7",
//                   "productId": "64474ff0a238c536a71088b2",
//                   "userId": "6450cf8ced27b7382a6a0bfe",
//                   "name": "user02",
//                   "email": "user02@gmail.com",
//                   "comment": "Đây là bình luận con của user02 trả lời user01",
//                   "parentCommentId": "64577a321b5b9cf3721576b0",
//                   "repliedToUsername": "user01",
//                   "isAdmin": false,
//                   "purchased": true,
//                   "createdAt": "2023-05-07T10:17:51.764Z",
//                   "updatedAt": "2023-05-07T10:17:51.764Z",
//                   "__v": 0,
//                   "replies": [
//                       {
//                           "_id": "6457909e442d6c7049db3bf4",
//                           "productId": "64474ff0a238c536a71088b2",
//                           "userId": "6447abde378c43e767c9e66c",
//                           "name": "TestUser",
//                           "email": "test@gmail",
//                           "comment": "Đây là bình luận con của user02 trả lời user02",
//                           "parentCommentId": "64577acf1b5b9cf3721576b7",
//                           "repliedToUsername": "user02",
//                           "isAdmin": true,
//                           "purchased": true,
//                           "createdAt": "2023-05-07T11:50:54.764Z",
//                           "updatedAt": "2023-05-07T11:50:54.764Z",
//                           "__v": 0,
//                           "replies": []
//                       }
//                   ]
//               },
//       }
              
//   ],
//   "total": 3
// }

// i wan't its like this:

// {
//   "success": true,
//   "comments": [
//       {
//           "_id": "64577a321b5b9cf3721576b0",
//           "productId": "64474ff0a238c536a71088b2",
//           "userId": "644726e5c975183b8afa4fc9",
//           "name": "user01",
//           "email": "user01@gmail.com",
//           "comment": "Đây là bình luận cha của user01",
//           "parentCommentId": null,
//           "repliedToUsername": null,
//           "isAdmin": false,
//           "purchased": true,
//           "createdAt": "2023-05-07T10:15:14.748Z",
//           "updatedAt": "2023-05-07T10:15:14.748Z",
//           "__v": 0,
//           "replies": [
//               {
//                   "_id": "64577acf1b5b9cf3721576b7",
//                   "productId": "64474ff0a238c536a71088b2",
//                   "userId": "6450cf8ced27b7382a6a0bfe",
//                   "name": "user02",
//                   "email": "user02@gmail.com",
//                   "comment": "Đây là bình luận con của user02 trả lời user01",
//                   "parentCommentId": "64577a321b5b9cf3721576b0",
//                   "repliedToUsername": "user01",
//                   "isAdmin": false,
//                   "purchased": true,
//                   "createdAt": "2023-05-07T10:17:51.764Z",
//                   "updatedAt": "2023-05-07T10:17:51.764Z",
//                   "__v": 0,
//                   "replies": []
//               },
//               {
//                 "_id": "6457909e442d6c7049db3bf4",
//                 "productId": "64474ff0a238c536a71088b2",
//                 "userId": "6447abde378c43e767c9e66c",
//                 "name": "TestUser",
//                 "email": "test@gmail",
//                 "comment": "Đây là bình luận con của user02 trả lời user02",
//                 "parentCommentId": "64577acf1b5b9cf3721576b7",
//                 "repliedToUsername": "user02",
//                 "isAdmin": true,
//                 "purchased": true,
//                 "createdAt": "2023-05-07T11:50:54.764Z",
//                 "updatedAt": "2023-05-07T11:50:54.764Z",
//                 "__v": 0,
//                 "replies": []
//             }
//           ]
//       }
              
//     ],
//   "total": 3
// }

