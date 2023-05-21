const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Rating = require("../models/ratingModel");
const Comment = require("../models/commentModel");
const Order = require("../models/orderModel");

//add product

exports.addProduct = async (req, res) => {
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
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền",
      });
    }
    const { name, manufacturer, type, release_date, description, price, img } = req.body
    if (!name || !manufacturer || !type || !release_date || !description || !price || !img) {
      return res.status(400).json({
        success: false,
        message: "Thiếu các trường bắt buộc",
      })
    }
    const product = new Product(req.body);
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Thêm sản phẩm thành công",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi thêm sản phẩm" });
  }
};

//update product

exports.updateProduct = async (req, res) => {
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
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyển",
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật sản phẩm",
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
        message: "Không được phép",
      });
    }
    const key = process.env.JWT_SEC;
    const decoded = jwt.verify(token, key);
    const user = await User.findOne({ email: decoded.email });
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền",
      });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    await Comment.deleteMany({ productId: req.params.id });

    return res.status(200).json({ success: true, message: "Xóa sản phẩm thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xóa sản phẩm sản phẩm" });
  }
};

//get product

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }
    const rating = await Rating.findOne({ productId: req.params.id });
    const avgRating = rating ? rating.avgRating : 0;
    const totalRating = rating ? rating.totalRating : 0;
    const productWithRating = {
      ...product.toJSON(),
      avgRating,
      totalRating,
    };
    return res.status(200).json({
      success: true,
      data: productWithRating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố khi xuất thông tin chi tiết sản phẩm" });
  }
};

//get all product

//Để sắp xếp theo thuộc tính tăng dần thì dùng /api/products?sortBy=Thuộc tính
//Ví dụ: /api/products?sortBy=price:asc để sắp xếp theo giá tăng dần.
//Để sắp xếp theo thuộc tính giảm dần thì dùng /api/products?sortBy=-Thuộc tính
//Ví dụ: /api/products?sortBy=-price:desc để sắp xếp theo giá giảm dần.


exports.getAllProducts = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const page = req.query.page ? Number(req.query.page) : 1;
    const startIndex = (page - 1) * limit;
    const type = req.headers.type ? decodeURIComponent(req.headers.type) : null;
    const sortBy = req.query.sortBy || "createdAt:desc";

    const [sortField, sortOrder] = sortBy.split(":");
    const sortObj = { [sortField]: sortOrder === "desc" ? -1 : 1 };

    const query = {};
    if (type) query.type = new RegExp("^" + type + "$", "i");

    const lengthAllProduct = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortObj)
      .skip(startIndex)
      .limit(limit);
    const ratingMap = await Rating.find({ productId: { $in: products.map((p) => p._id) } })
      .select("productId avgRating totalRating")
      .lean()
      .exec();
    const ratingDict = ratingMap.reduce((acc, curr) => {
      acc[curr.productId] = curr;
      return acc;
    }, {});
    const productsWithRating = products.map((p) => ({
      ...p.toJSON(),
      avgRating: ratingDict[p._id]?.avgRating || 0,
      totalRating: ratingDict[p._id]?.totalRating || 0,
    }));

    res.status(200).json({
      success: true,
      data: productsWithRating,
      length: lengthAllProduct,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Đã sảy ra sự cố khi xuất thông tin sản phẩm" });
  }
};

//search product

exports.searchProducts = async (req, res) => {
  try {
    const query = {};
    if (req.body.name) {
      query.name = new RegExp(req.body.name, "i");
    }

    const lengthAllProduct = await Product.countDocuments(query);
    const products = await Product.find(query);

    const ratingMap = await Rating.find({ productId: { $in: products.map((p) => p._id) } })
      .select("productId avgRating totalRating")
      .lean()
      .exec();
    const ratingDict = ratingMap.reduce((acc, curr) => {
      acc[curr.productId] = curr;
      return acc;
    }, {});
    const productsWithRating = products.map((p) => ({
      ...p.toJSON(),
      avgRating: ratingDict[p._id]?.avgRating || 0,
      totalRating: ratingDict[p._id]?.totalRating || 0,
    }));

    res.status(200).json({
      success: true,
      data: productsWithRating,
      length: lengthAllProduct,
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: "Đẵ xảy ra sự cố khi tìm sản phẩm" });
  }
};

//get top sales products

exports.getTopSalesProducts = async (req, res) => {
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
    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền",
      });
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0, 23, 59, 59, 999),
      },
    });
    const products = {};
    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (order.status === "Đã giao")
          if (products[product.id]) {
            products[product.id].quantity += product.quantity;
          } else {
            products[product.id] = {
              name: product.name,
              manufacturer: product.manufacturer,
              type: product.type,
              img: product.img,
              price: product.price,
              quantity: product.quantity,
            };
          }
      });
    });
    const topProducts = Object.values(products)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    
    res.json({ success: true, data: topProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xuất những sản phẩm bán chạy" });
  }
};

