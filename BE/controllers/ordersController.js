const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const jwt = require("jsonwebtoken");
const SalesReport = require("../models/salesReportModel");
const Rating = require("../models/ratingModel");
const { isEmpty } = require("lodash");

//create order with COD

exports.createOrder = async (req, res) => {
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
          message: "Không tìm thấy tài khoản",
        });
      }
      const cart = await Cart.findOne({ userId: user._id });
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy giỏ hàng",
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
        methods: "COD (thanh toán khi giao hàng)",
        status: "Đang chờ"
      });
      for (const product of newOrder.products) {
        const productRating = await Rating.findOne({ productId: product.id });
        let userRating = 0;
        if (productRating) {
          const userRatingObj = productRating.users.find(
            (ratingObj) => ratingObj.id.toString() === user._id.toString()
          );
          if (userRatingObj) {
            userRating = userRatingObj.rating;
          }
        }
        product.rating = userRating;
      }
      newOrder.address =
        address ||
        `${newOrder.streetAndHouseNumber}, ${newOrder.wards}, ${newOrder.district}, ${newOrder.city}`;
      if (
        isEmpty(newOrder.name) ||
        isEmpty(newOrder.phone) ||
        isEmpty(newOrder.city) ||
        isEmpty(newOrder.district) ||
        isEmpty(newOrder.wards) ||
        isEmpty(newOrder.streetAndHouseNumber) ||
        isEmpty(newOrder.address)
      ) {
        return res.status(400).json({
          success: false,
          message: "Thiếu các trường bắt buộc",
        });
      }
      for (const product of newOrder.products) {//// this don't touch
        product.rating = 0;
      }
      await newOrder.save();
      await cart.deleteOne({ userId: user._id });
      return res.status(200).json({
        success: true,
        message: "Đặt hàng thành công",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Đã xảy ra sự cố khi đặt hàng" });
    }
  };

  //create order with MOMO

exports.createOrderWithMomo = async (req, res) => {
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
        message: "Không tìm thấy tài khoản",
      });
    }
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng",
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
      methods: "Thanh toán với MOMO",
      status: "Đã thanh toán"
    });
    for (const product of newOrder.products) {
      const productRating = await Rating.findOne({ productId: product.id });
      let userRating = 0;
      if (productRating) {
        const userRatingObj = productRating.users.find(
          (ratingObj) => ratingObj.id.toString() === user._id.toString()
        );
        if (userRatingObj) {
          userRating = userRatingObj.rating;
        }
      }
      product.rating = userRating;
    }
    newOrder.address =
      address ||
      `${newOrder.streetAndHouseNumber}, ${newOrder.wards}, ${newOrder.district}, ${newOrder.city}`;
    if (
      isEmpty(newOrder.name) ||
      isEmpty(newOrder.phone) ||
      isEmpty(newOrder.city) ||
      isEmpty(newOrder.district) ||
      isEmpty(newOrder.wards) ||
      isEmpty(newOrder.streetAndHouseNumber) ||
      isEmpty(newOrder.address)
    ) {
      return res.status(400).json({
        success: false,
        message: "Thiếu các trường bắt buộc",
      });
    }
    for (const product of newOrder.products) {//// this don't touch
      product.rating = 0;
    }
    await newOrder.save();
    await cart.deleteOne({ userId: user._id });
    return res.status(200).json({
      success: true,
      message: "Đặt hàng thành công",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố khi đặt hàng" });
  }
};


//get user orders

exports.getOrders = async (req, res) => {
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
                message: 'Không tìm thấy tài khoản',
            });
        }
        const order = await Order.find({ userId: user._id }).sort({ createdAt: -1 })
        if (!order) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy lịch sử đơn hàng',
            });
        }
        return res.status(200).json({
            success: true,
            data: order,
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xuất lịch sử đơn hàng" });
    }
}


//get all orders by admin
exports.getAllOrders = async (req, res) => {
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
        const order = await Order.find().sort({ createdAt: -1 });
        if (!order) {
            return res.status(401).json({
                success: false,
                message: "Không có đơn hàng",
            });
        }
        return res.status(200).json({
            success: true,
            data: order,
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xuất thông tin các đơn hàng" });
    }
}

//confirm order

exports.confirmOrder = async (req, res) => {
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
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng",
            });
        }
        if (order.status !== "Đang chờ" || order.status !== "Đã thanh toán") {
            return res.status(400).json({
                success: false,
                message: "Không thể xác nhận đơn hàng khi đang ở trạng thái trên",
            });
        }
        order.status = "Xác nhận";
        await order.save();
        return res.status(200).json({
            success: true,
            message: "Xác nhận đơn hàng thành công",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Dẵ xảy ra sự cố khi xác nhận đơn hàng" });
    }
};


//delivered order


exports.deliveryOrder = async (req, res) => {
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
    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Không tìm thấy đơn hàng",
        });
    }
    if (order.status !== "Xác nhận") {
        return res.status(400).json({
            success: false,
            message: "Chỉ có thể xác nhận đã giao hàng khi đã xác nhận đơn hàng",
        });
    }
    let amount = 0;
    order.products.forEach((product) => {
      amount += product.quantity;
    });
    const today = new Date();
    const salesReportDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let salesReport = await SalesReport.findOne({ date: salesReportDate });
    if (!salesReport) {
      salesReport = new SalesReport({
        date: salesReportDate,
        totalSales: order.total,
        numberOfOrders: 1,
        totalUsers: 1,
        totalProducts: amount,
      });
    } else {
      salesReport.totalSales += order.total;
      salesReport.numberOfOrders++;
      const existingOrder = await Order.findOne({ userId: order.userId, createdAt: { $gte: salesReportDate }, status: "delivered" });
      if (!existingOrder) {
        salesReport.totalUsers++;
      }
      salesReport.totalProducts += amount;
    }
    await salesReport.save();
    order.status = "Đã giao";
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Xác nhận đã giao hàng thành công",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố khi xác nhận giao hàng" });
  }
};

// cancel order when user

exports.cancelOrderUser = async (req, res) => {
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
      const order = await Order.findById(req.params.id);
      if (!order) {
          return res.status(404).json({
              success: false,
              message: "Không tìm thấy đơn hàng",
          });
      }
      if (order.status !== "Đang chờ" || order.status !== "Đã thanh toán") {
          return res.status(400).json({
              success: false,
              message: "Chỉ có thể hủy đơn hàng khi đơn hàng đang đợi xác nhận",
          });
      }
      order.status = "Đã hủy";
      await order.save();
      return res.status(200).json({
          success: true,
          message: "Hủy đơn hàng thành công",
      });
  } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi hủy đơn hàng" });
  }
};

// cancel order when admin

exports.cancelOrderAdmin = async (req, res) => {
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
      const order = await Order.findById(req.params.id);
      if (!user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: "Bạn không có quyền",
        });
      }
      if (!order) {
          return res.status(404).json({
              success: false,
              message: "Không tìm thấy đơn hàng",
          });
      }
      if (order.status == "Đã giao") {
          return res.status(400).json({
              success: false,
              message: "Không thể hủy đơn hàng khi đã giao hàng",
          });
      }
      order.status = "Đã hủy";
      await order.save();
      return res.status(200).json({
          success: true,
          message: "Hủy đơn hàng thành công",
      });
  } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi hủy đơn hàng" });
  }
};
