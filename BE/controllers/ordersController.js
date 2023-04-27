const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const jwt = require("jsonwebtoken");

//create order

exports.createOrder = async (req, res) => {
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
                message: 'User not found',
            });
        }
        const cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }
        const newOrder = new Order({
            userId: user._id,
            products: cart.products,
            total: cart.total,
            phone: user.phone,
            address: user.address,
        });
        await newOrder.save();
        await cart.deleteOne({userId: user._id})
        return res.status(200).json({
            success: true,
            message: "Order created successfully"
        })
    } catch (err) {
        res.status(500).json({ success: false, message: "something went wrong" });
    }
};