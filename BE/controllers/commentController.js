// const User = require("../models/userModel");
// const { json } = require("body-parser");
// const jwt = require("jsonwebtoken");
// const Product = require("../models/productModel");
// const Comment = require("../models/commentModel");

// //add comment

// exports.addComment = async (req, res) => {
//     try {
//         const token = req.headers.authentication;
//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Unauthorized',
//             });
//         }
//         const key = process.env.JWT_SEC;
//         const decoded = jwt.verify(token, key);
//         const user = await User.findOne({ email: decoded.email });
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User not found or invalid token',
//             });
//         }
//         const product = await Product.findById(req.body.id);
//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found',
//             });
//         }
//         if (!req.body.comment) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Comment cannot be empty',
//             });
//         }
//         const parentCommentId = req.body.parentCommentId || null;
//         const newComment = new Comment({
//             productId: req.body.id,
//             users: [{
//                 id: user.id,
//                 name: user.name,
//                 email: user.email,
//                 comment: req.body.comment,
//             }],
//             parentComment: parentCommentId,
//         });
//         await newComment.save();
//         return res.status(200).json({
//             success: true,
//             message: 'Comment added successfully',
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({success: false, message: 'Something went wrong. Please try again later.',});
//     }
// };

// //get all comments of product

// exports.getAllComments = async (req, res) => {
//     try {
//         const product = await Product.findById(req.body.id);
//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found',
//             });
//         }
//         const comments = await Comment.find({ productId: req.body.id }).populate('parentComment');
//         return res.status(200).json({
//             success: true,
//             data : comments,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: 'Something went wrong. Please try again later.',
//         });
//     }
// };



