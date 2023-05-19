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
        message: "Không được phép",
      });
    }
    const key = process.env.JWT_SEC;
    const decoded = jwt.verify(token, key);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Bạn không có quyền",
      });
    }
    else {
      const product = await Product.findById({ _id: req.body.id });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sản phẩm",
        });
      }
      else {
        const cart = await Cart.findOne({ userId: user._id });
        if (!cart && req.body) {
          const newCart = new Cart({
            userId: user.id,
            products: [
              {
                id: req.body.id,
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
            (product) => product.id == req.body.id
          );
          if (checkProduct >= 0) {
            const updatedProducts = [...cart.products];
            updatedProducts[checkProduct].quantity += req.body.quantity;
            await Cart.findByIdAndUpdate(
              { _id: cart.id },
              { products: updatedProducts, total: cart.total + product.price * req.body.quantity }
            );
          } else {
            const newProduct = {
              id: product.id,
              name: product.name,
              img: product.img,
              type: product.type,
              price: product.price,
              quantity: req.body.quantity,
            };
            const updatedProducts = [...cart.products, newProduct];
            await Cart.findByIdAndUpdate(
              { _id: cart.id },
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
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi thêm vào giỏ" });
  }
};

//update product quantity

exports.updateCart = async (req, res) => {
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
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
      });
    }
    const productId = req.params.id;
    const product = cart.products.find((product) => String(product.id) === productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong giỏ",
      });
    }
    const newQuantity = req.body.quantity;
    if (!newQuantity || newQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Số lượng phải lớn hơn 0",
      });
    }
    const productIndex = cart.products.findIndex((product) => String(product.id) === productId);
    const updatedProducts = [...cart.products];
    const oldQuantity = updatedProducts[productIndex].quantity;
    updatedProducts[productIndex].quantity = newQuantity;
    const newTotal = cart.total - (oldQuantity * product.price) + (newQuantity * product.price);
    await Cart.findByIdAndUpdate(
      { _id: cart.id },
      { products: updatedProducts, total: newTotal }
    );
    const updatedCart = await Cart.findById(cart.id);
    return res.status(200).json({
      success: true,
      data: updatedCart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi cập nhật số lượng sản phẩm" });
  }
};

//delete cart products

exports.deleteCartProducts = async (req, res) => {
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
        message: "Không tìm thấy người",
      });
    }
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }
    const productId = req.params.id;
    const products = cart.products.filter(val => val.id !== productId);
    const deletedProduct = cart.products.find(val => val.id === productId);
    const deletedQuantity = deletedProduct.price * deletedProduct.quantity;
    const newTotal = cart.total - deletedQuantity;
    if (products.length === 0) {
      await Cart.findOneAndDelete({ userId: user._id });
      return res.status(200).json({
        success: true,
        message: "Xóa giỏ hàng thành công"
      });
    }
    await Cart.findOneAndUpdate({ userId: user._id }, {products, total: newTotal});
    return res.status(200).json({
      success: true,
      message: "Xóa sản phẩm trong giỏ thành công"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xóa sản phẩm trong giỏ hàng" });
  }
};

//delete cart

exports.deleteCart = async (req, res) => {
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
    const cart = await Cart.findOneAndDelete({ userId: user._id });
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }
    return res.status(200).json({
      success: true,
      data: null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xóa giỏ hàng" });
  }
};

//get cart

exports.getCart = async (req, res) => {
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
        message: "không tìm thấy người dùng",
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
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố khi xuất giỏ hàng của người dùng" });
  }
};

//get amount of products

exports.getAmountCart = async (req, res) => {
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
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố khi lấy tổng sản phẩm trong giỏ hàng" });
  }
};

