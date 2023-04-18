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
              { products: updatedProducts, total: cart.total + product.price * req.body.quantity }
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

//edit product quantity

exports.updateCart = async (req, res) => {
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
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    const productId = req.params.id;
    const product = cart.products.find((product) => String(product._id) === productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }
    const newQuantity = req.body.quantity;
    if (!newQuantity || newQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }
    const productIndex = cart.products.findIndex((product) => String(product._id) === productId);
    const updatedProducts = [...cart.products];
    const oldQuantity = updatedProducts[productIndex].quantity;
    updatedProducts[productIndex].quantity = newQuantity;
    const newTotal = cart.total - (oldQuantity * product.price) + (newQuantity * product.price);
    await Cart.findOneAndUpdate(
      { _id: cart._id },
      { products: updatedProducts, total: newTotal }
    );
    const updatedCart = await Cart.findById(cart._id);
    return res.status(200).json({
      success: true,
      data: updatedCart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//get amount of products

exports.getAmountCart = async (req, res) => {
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
    let amount = 0;
    cart.products.forEach((products)=>{
      amount += products.quantity
    });
    res.status(200).json({
      success: true,
      data: amount,
    });
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