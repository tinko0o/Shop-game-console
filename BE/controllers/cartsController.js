const User = require("../models/userModel");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

//add user cart

exports.addCart = async (req, res) => {
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
        else {
            const product = await Product.findById({ _id: req.body._id });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found',
                });
            }
            else {
                const cart = await Cart.findOne({ userId: user._id });
                if (!cart && req.body) {
                    const newCart = new Cart({
                        userId: user._id,
                        products: [
                            {
                                _id: req.body._id,
                                name: product.name,
                                img: product.img,
                                type: product.type,
                                price: product.price,
                                quantity: req.body.quantity,
                            },
                        ],
                        total: product.price * req.body.quantity,
                    })
                    await newCart.save();
                    return res.status(200).json({
                        success: true,
                        data: newCart,
                    });
                }
                else {
                    const checkProduct = cart.products.findIndex(
                        (product) => product._id == req.body._id
                    );
                    if (checkProduct >= 0) {
                        const updatedProducts = [...cart.products];
                        updatedProducts[checkProduct].quantity += req.body.quantity;
                        await Cart.findOneAndUpdate(
                            { _id: cart._id },
                            { products: updatedProducts }
                        );
                    } else {
                        const newProduct = {
                            _id: product._id,
                            name: product.name,
                            img: product.img,
                            type: product.type,
                            price: product.price,
                            quantity: req.body.quantity,
                        };
                        const updatedProducts = [...cart.products, newProduct];
                        await Cart.findOneAndUpdate(
                            { _id: cart._id },
                            { products: updatedProducts, total: cart.total + product.price * req.body.quantity }
                        );
                    }
                    return res.status(200).json({
                        success: true,
                        data: await Cart.findOne({ userId: user._id }),
                    });
                }
            }
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "something went wrong" });
    }
};

//get user cart

exports.getUserCart = async (req, res) => {
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
        const cart = await Cart.findOne({ userId: user._id })
        if (!cart) {
            return res.status(200).json({
                success: true,
                data: null,
            });
        }
        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "something went wrong" });
    }
};