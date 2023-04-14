const User = require("../models/userModel");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cartModel");

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
        const cart = await Cart.findOne({ userId: user._id });
        if (!cart && req.body) {
            const newCart = new Cart({
                userId: user._id,
                cart: req.body,
            })
            await newCart.save();
        }
        else if(req.body){
            const newCart = [...cart.products, req.body]
            await Cart.findOneAndUpdate({ products: newCart })
        }
        else
        {
            return res.status(500).json({
                success: false,
                message: "Invalid",
            })
        }
        res.status(200).json({
            success: true,
            data: req.body,
        })
    } catch (err) {
        res.status(500).json({ success: false, message: "something went wrong" });
    }
};
