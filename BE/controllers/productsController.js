const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const User = require("../models/userModel");

//add product

exports.addProduct = async (req, res) => {
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
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(200).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "An error occurred while adding the product" });
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
    const user = await User.findOne({ email: decoded.email });
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product",
    });
  }
};

//delete product

exports.deleteProduct = async (req, res) => {
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
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while deleting product" });
  }
};

//get all products

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query string or default to page 1
    const limit = parseInt(req.query.limit) || 10; // Get the limit from the query string or default to 10 items per page
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    const products = await Product.find().skip(startIndex).limit(limit);

    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit: limit,
      };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
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
      data:product,
    });
  }catch(err){
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

exports.getProducts = async (req, res) => {
  // const skip = req.query.skip ? Number(req.query.skip) : 0;
  const limit = req.query.limit ? Number(req.query.limit) : 0;
  const page = req.query.page ? Number(req.query.page) * limit - limit : 0;
  const name = req.headers.search;
  const type = req.headers.type;
  if (name) {
    try {
      const product = await Product.find();
      const findData = product.filter((val) => {
        return val.name.toLowerCase().includes(name.toLowerCase());
      });
      if (findData.length !== 0) {
        const getLinit = findData.slice(page, page + limit);

        return res.status(200).json({
          success: true,
          data: getLinit,
          length: findData.length,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, state: "Input not found!" });
      }
    } catch (err) {
      res.status(500).json({ success: false, state: "Something wrong!" });
    }
  }
  // 
  else 
  if(type){
    try {
      const product = await Product.find();
      const findDataType = product.filter((val) => {
        return val.type.toLowerCase().includes(type.toLowerCase());
      });
      if (findDataType.length !== 0) {
        const getLinit = findDataType.slice(page, page + limit);
        return res.status(200).json({
          success: true,
          data: getLinit,
          length: findDataType.length,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, state: "Input not found!" });
      }
    } catch (err) {
      res.status(500).json({ success: false, state: "Something wrong!" });
    }
  }
  //
  else {
    try {
      const lengthALLProduct = await Product.count();
      const products = await Product.find().skip(page).limit(limit);
      res.status(200).json({
        success: true,
        data: products,
        length: lengthALLProduct,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};