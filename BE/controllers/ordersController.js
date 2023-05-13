const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const jwt = require("jsonwebtoken");
const SalesReport = require("../models/salesReportModel")
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
        const { name, phone, city, district, wards, streetAndHouseNumber, address } = req.body;
        const newOrder = new Order({
            userId: user._id,
            products: cart.products,
            total: cart.total,
            name: name || user.name,
            phone: phone || user.phone,
            city: city || user.city,
            district: district || user.district,
            wards: wards || user.wards,
            streetAndHouseNumber: streetAndHouseNumber || user.streetAndHouseNumber,
        });
        newOrder.address = address || `${newOrder.streetAndHouseNumber}, ${newOrder.wards}, ${newOrder.district}, ${newOrder.city}`;
        if (isEmpty(newOrder.name) || isEmpty(newOrder.phone) || isEmpty(newOrder.city) || isEmpty(newOrder.district)
            || isEmpty(newOrder.wards) || isEmpty(newOrder.streetAndHouseNumber) || isEmpty(newOrder.address)) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            })
        }
        let amount = 0;
        cart.products.forEach((products) => {
            amount += products.quantity
        });
        const today = new Date();
        const salesReportDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let salesReport = await SalesReport.findOne({ date: salesReportDate });
        if (!salesReport) {
            salesReport = new SalesReport({
                date: salesReportDate,
                totalSales: newOrder.total,
                numberOfOrder: 1,
                totalUsers: 1,
                totalProducts: amount,
            });
        } else {
            salesReport.totalSales += newOrder.total;
            salesReport.numberOfOrder++;
            const existingOrder = await Order.findOne({ userId: user._id, createdAt: { $gte: salesReportDate } });
            if (!existingOrder) {
                salesReport.totalUsers++;
            }
            salesReport.totalProducts += amount;
        }

        await salesReport.save();
        await newOrder.save();
        await cart.deleteOne({ userId: user._id });
        return res.status(200).json({
            success: true,
            message: "Order created successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};




//get user orders

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
        const order = await Order.find({ userId: user._id }).sort({ createdAt: -1 })
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

//get all orders by admin

exports.getAllOrders = async (req, res) => {
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
        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
            });
        }
        const order = await Order.find().sort({ createdAt: -1 });
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