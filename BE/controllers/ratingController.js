const User = require("../models/userModel");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Rating = require("../models/ratingModel");
const Order = require("../models/orderModel");


//add rating input: req.body = { id}
exports.addRating = async (req, res) => {
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
        const product = await Product.findById({_id: req.body.id});
        if (!product) {
          return res.status(404).json({
            success: false,
            message: 'Product not found',
          });
        }
        else {
          const rating = await Rating.findOne({ productId: product._id });
          if (!rating && req.body) {
            const newRating = new Rating({
              productId: product.id,
              users: [
                {
                  id: req.body.id,
                  ratting: req.body.rating,
                },
              ],
              rationg: product.price * req.body.quantity,
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
      res.status(500).json({ success: false, message: "something went wrong" });
    }
  };