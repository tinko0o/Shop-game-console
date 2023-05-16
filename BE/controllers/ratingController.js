const User = require("../models/userModel");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const Rating = require("../models/ratingModel");
const Order = require("../models/orderModel");


//add rating

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

    const product = await Product.findById(req.body.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const order = await Order.findOne({ userId: user.id, "products.id": req.body.id });
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "You can only rate products that you have ordered",
      });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "You can only rate delivered products",
      });
    }

    const rating = req.body.rating;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be from 1 to 5",
      });
    }

    const existingRating = await Rating.findOne({ productId: req.body.id });
    if (!existingRating) {
      const newRating = new Rating({
        productId: req.body.id,
        users: [
          {
            id: user.id,
            name: user.name,
            email: user.email,
            rating: rating,
          },
        ],
        avgRating: rating,
        totalRating: 1,
      });
      await newRating.save();
      return res.status(200).json({
        success: true,
        data: newRating,
      });
    } else {
      const userRatingIndex = existingRating.users.findIndex(
        (u) => u.id.toString() === user.id.toString()
      );    
      if (userRatingIndex >= 0) {
        return res.status(400).json({
          success: false,
          message: "You have already rated this product in the current order",
        });
      }
      // if (userRatingIndex >= 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "You have already rated this product",
      //   });
      // }
      const updatedUsers = [
        ...existingRating.users,
        {
          id: user.id,
          name: user.name,
          email: user.email,
          rating: rating,
        },
      ];
      const sumOfRatings = updatedUsers.reduce((acc, cur) => acc + cur.rating, 0);
      const totalRating = updatedUsers.length;
      const roundedAvgRating = Math.round((sumOfRatings / totalRating) * 2) / 2;
      await existingRating.updateOne({
        users: updatedUsers,
        avgRating: roundedAvgRating,
        totalRating: totalRating,
      });

      return res.status(200).json({
        success: true,
        data: await Rating.findOne({ productId: product._id }),
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};



// const userRatingIndex = existingRating.users.findIndex(
//   (u) => u.id.toString() === user.id.toString()
// );

// if (userRatingIndex >= 0) {
//   // User has already rated, update the existing rating
//   existingRating.users[userRatingIndex].rating = rating;

//   const sumOfRatings = existingRating.users.reduce((acc, cur) => acc + cur.rating, 0);
//   const totalRating = existingRating.users.length;
//   const roundedAvgRating = Math.round((sumOfRatings / totalRating) * 2) / 2;

//   await existingRating.updateOne({
//     users: existingRating.users,
//     avgRating: roundedAvgRating,
//     totalRating: totalRating,
//   });

//   return res.status(200).json({
//     success: true,
//     data: await Rating.findOne({ productId: product._id }),
//   });
// } else {
//   // User hasn't rated before, add a new rating entry
//   const updatedUsers = [
//     ...existingRating.users,
//     {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       rating: rating,
//     },
//   ];

//   const sumOfRatings = updatedUsers.reduce((acc, cur) => acc + cur.rating, 0);
//   const totalRating = updatedUsers.length;
//   const roundedAvgRating = Math.round((sumOfRatings / totalRating) * 2) / 2;

//   await existingRating.updateOne({
//     users: updatedUsers,
//     avgRating: roundedAvgRating,
//     totalRating: totalRating,
//   });

//   return res.status(200).json({
//     success: true,
//     data: await Rating.findOne({ productId: product._id }),
//   });
// }




// exports.addRating = async (req, res) => {
//   try {
//     const token = req.headers.authentication;
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }
//     const key = process.env.JWT_SEC;
//     const decoded = jwt.verify(token, key);
//     const user = await User.findOne({ email: decoded.email });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not found',
//       });
//     }

//     const product = await Product.findById(req.body.id);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found',
//       });
//     }

//     const orders = await Order.updateMany(
//       { userId: user.id, "products.id": req.body.id },
//       { $set: { "products.$.rating": req.body.rating } }
//     );

//     if (orders.nModified === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "You can only rate products that you have ordered",
//       });
//     }

//     const rating = req.body.rating;
//     if (rating < 1 || rating > 5) {
//       return res.status(400).json({
//         success: false,
//         message: "Rating must be from 1 to 5",
//       });
//     }
//     const existingRating = await Rating.findOne({ productId: req.body.id });
//     if (!existingRating) {
//       const newRating = new Rating({
//         productId: req.body.id,
//         users: [
//           {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             rating: rating,
//           },
//         ],
//         avgRating: rating,
//         totalRating: 1,
//       });
//       await newRating.save();
//       return res.status(200).json({
//         success: true,
//         data: newRating,
//       });
//     } else {
//       const userRatingIndex = existingRating.users.findIndex(
//         (u) => u.id.toString() === user.id.toString()
//       );
//       if (userRatingIndex >= 0) {
//         return res.status(400).json({
//           success: false,
//           message: "You have already rated this product",
//         });
//       }
//       const updatedUsers = [
//         ...existingRating.users,
//         {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           rating: rating,
//         },
//       ];
//       const sumOfRatings = updatedUsers.reduce((acc, cur) => acc + cur.rating, 0);
//       const totalRating = updatedUsers.length;
//       const roundedAvgRating = Math.round((sumOfRatings / totalRating) * 2) / 2;
//       await existingRating.updateOne({
//         users: updatedUsers,
//         avgRating: roundedAvgRating,
//         totalRating: totalRating,
//       });

//       return res.status(200).json({
//         success: true,
//         data: await Rating.findOne({ productId: product._id }),
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// };

