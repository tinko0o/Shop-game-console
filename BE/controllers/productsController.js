const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const User = require("../models/userModel");

//add product

exports.addProduct = async (req, res) => {
  try {
    const token = req.headers.authentication;
    if (!token) {
      res.status(401).json({
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
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(200).json({
      success: true,
      message: "success",
      newProduct,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred while adding product" });
  }
}

//update product

exports.updateProduct = async (req, res) => {
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
    const user = await User.findOne({ email: decoded.email })
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating product",
    });
  }
};

//delete product

exports.deleteProduct = async (req, res) => {
  try {
    const token = req.headers.authentication;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const key = process.env.JWT_SEC;
    const decoded = jwt.verify(token, key);
    const user = await User.findOne({ email: decoded.email })
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    await Product.findByIdAndRemove(req.params.id);
    res.status(200).json({ success: true, message: "product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred while deleting product" });
  }
};

//get all products

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//get product

exports.getProduct = async (req,res) =>{
  try{
    const product = await Product.findById(req.params.id);
    res.status(200).json({
      success: true,
      product,
    });
  }catch(err){
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}