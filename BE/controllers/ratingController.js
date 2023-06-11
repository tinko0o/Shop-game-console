const User = require("../models/userModel");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const Rating = require("../models/ratingModel");
const Order = require("../models/orderModel");

// add rating
exports.addRating = async (req, res) => {
  try {
    const token = req.headers.authentication;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const key = process.env.JWT_SEC;
    const decoded = jwt.verify(token, key);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const order = await Order.findOne({
      _id: req.body.orderId,
      userId: user._id,
      "products.id": req.body.productId,
    }).sort({ createdAt: -1 });
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "You can only rate products that you have ordered",
      });
    }
    if (order.status !== "Đã giao") {
      return res.status(400).json({
        success: false,
        message: "You can only rate delivered products",
      });
    }
    const rating = req.body.rating;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be from 1 to 5",
      });
    }
    let existingRating = await Rating.findOne({
      productId: req.body.productId,
    });
    if (!existingRating) {
      existingRating = new Rating({
        productId: req.body.productId,
        users: [],
        avgRating: 0,
        totalRating: 0,
      });
    }
    const userRating = {
      id: user._id,
      name: user.name,
      email: user.email,
      rating: rating,
    };
    existingRating.users.push(userRating);
    const sumOfRatings = existingRating.users.reduce(
      (acc, cur) => acc + cur.rating,
      0
    );
    const totalRating = existingRating.users.length;
    const roundedAvgRating = Math.round((sumOfRatings / totalRating) * 2) / 2;
    existingRating.avgRating = roundedAvgRating;
    existingRating.totalRating = totalRating;
    await existingRating.save();
    await Order.updateOne(
      { _id: req.body.orderId, "products.id": req.body.productId },
      { $set: { "products.$.rating": req.body.rating } }
    );
    return res.status(200).json({
      success: true,
      data: existingRating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
