const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const jwt = require("jsonwebtoken");
const { isEmpty } = require("lodash");

//create order with default information

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
        const {name, phone, address} = req.body;
        const newOrder = new Order({
            userId: user._id,
            products: cart.products,
            total: cart.total,
            name: name || user.name,
            phone: phone || user.phone,
            address: address || user.address,
        });
        if (isEmpty(newOrder.name) || isEmpty(newOrder.phone) || isEmpty(newOrder.address)) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            })
        }
        await newOrder.save();
        await cart.deleteOne({ userId: user._id })
        return res.status(200).json({
            success: true,
            message: "Order created successfully"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "something went wrong" });
    }
};

//get orders

exports.getOrders = async (req, res) => {
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
        const order = await Order.find({ userId: user._id })
        if (!order) {
            return res.status(401).json({
                success: false,
                message: 'Order not found',
            });
        }
        return res.status(200).json({
            success: true,
            data: order,
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "something went wrong" });
    }
}

// exports.createOrder = async (req, res) => {
//     try {
//         const token = req.headers.authentication;
//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized",
//             });
//         }
//         const key = process.env.JWT_SEC;
//         const decoded = jwt.verify(token, key);
//         const user = await User.findOne({ email: decoded.email });
//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User not found',
//             });
//         }
//         const cart = await Cart.findOne({ userId: user._id });
//         if (!cart) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Cart not found",
//             });
//         }
//         let name = user.name;
//         let phone = user.phone;
//         let address = user.address;
//         if (!name || !phone || !address) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing required fields",
//             })
//         }
//         const newOrder = new Order({
//             userId: user._id,
//             products: cart.products,
//             total: cart.total,
//             name: req.body.name || name,
//             phone: req.body.phone || phone,
//             address: req.body.address || address,
//         });
//         await newOrder.save();
//         await cart.deleteOne({ userId: user._id })
//         return res.status(200).json({
//             success: true,
//             message: "Order created successfully"
//         })
//     } catch (err) {
//         res.status(500).json({ success: false, message: "something went wrong" });
//     }
// };