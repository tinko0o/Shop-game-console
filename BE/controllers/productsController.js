const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Rating = require("../models/ratingModel");

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
    const { name, manufacturer, type, release_date, description, price, img } = req.body
    if (!name || !manufacturer || !type || !release_date || !description || !price || !img) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      })
    }
    const product = new Product(req.body);
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "An error occurred while adding the product" });
  }
};

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
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
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
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred while deleting product" });
  }
};

//get product

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
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
    res.status(500).json({ success: false, message: "something went wrong" });
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
    const name = req.headers.search;
    const type = req.headers.type;
    let sortObj = {};

    if (req.query.sortBy) {
      const [sortField, sortOrder] = req.query.sortBy.split(":");
      sortObj[sortField] = sortOrder === "desc" ? -1 : 1;
    } else {
      sortObj = { createdAt: -1 }; // default to sort by createdAt in descending order
    }

    if (name) {
      const product = await Product.find();
      const findData = product.filter((val) => {
        return val.name.toLowerCase().includes(name.toLowerCase());
      });
      if (findData.length !== 0) {
        const getLimit = findData.sort(sortObj).slice(startIndex, startIndex + limit);
        return res.status(200).json({
          success: true,
          data: getLimit,
          length: findData.length,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, state: "Input not found!" });
      }
    } else if (type) {
      const product = await Product.find();
      const findDataType = product.filter((val) => {
        return val.type.toLowerCase().includes(type.toLowerCase());
      });
      if (findDataType.length !== 0) {
        const getLimit = findDataType.sort(sortObj).slice(startIndex, startIndex + limit);
        return res.status(200).json({
          success: true,
          data: getLimit,
          length: findDataType.length,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, state: "Input not found!" });
      }
    } else {
      const lengthALLProduct = await Product.countDocuments();
      const products = await Product.find().sort({ createdAt: -1 }).skip(startIndex).limit(limit);
      res.status(200).json({
        success: true,
        data: products,
        length: lengthALLProduct,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


// exports.getAllProducts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     const total = await Product.countDocuments();

//     const sortBy = req.query.sortBy || "createdAt:desc"; // default to sort by createdAt in descending order
//     const [sortField, sortOrder] = sortBy.split(":");
//     const sortObj = {};
//     sortObj[sortField] = sortOrder === "desc" ? -1 : 1;

//     const products = await Product.find()
//       .sort(sortObj)
//       .skip(startIndex)
//       .limit(limit);
//     const productIds = products.map((product) => product._id);
//     const ratings = await Rating.find({ productId: { $in: productIds } });
//     const ratingMap = {};
//     ratings.forEach((rating) => {
//       ratingMap[rating.productId] = rating;
//     });

//     const productsWithRating = products.map((product) => {
//       const rating = ratingMap[product._id];
//       const avgRating = rating ? rating.avgRating : 0;
//       const totalRating = rating ? rating.totalRating : 0;
//       return {
//         ...product.toJSON(),
//         avgRating,
//         totalRating,
//       };
//     });

//     const pagination = {};
//     if (endIndex < total) {
//       pagination.next = {
//         page: page + 1,
//         limit: limit,
//         sortBy: sortBy,
//       };
//     }

//     if (startIndex > 0) {
//       pagination.prev = {
//         page: page - 1,
//         limit: limit,
//         sortBy: sortBy,
//       };
//     }

//     res.status(200).json({
//       success: true,
//       count: productsWithRating.length,
//       pagination,
//       data: productsWithRating,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// };



//search for a product

exports.searchProducts = async (req, res) => {
  try {
    const { name, manufacturer, type } = req.query;
    const searchString = {};

    if (name) {
      searchString.name = { $regex: new RegExp(name, "i") };
    }

    if (manufacturer) {
      searchString.manufacturer = { $regex: new RegExp(manufacturer, "i") };
    }

    if (type) {
      searchString.type = { $regex: new RegExp(type, "i") };
    }

    const products = await Product.find(searchString);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}




//CODE YOU DƯỚI, YOU TỰ FIX VỚI GẮN

// exports.getAllProducts = async (req, res) => {
//   // const skip = req.query.skip ? Number(req.query.skip) : 0;
//   const limit = req.query.limit ? Number(req.query.limit) : 0;
//   const page = req.query.page ? Number(req.query.page) * limit - limit : 0;
//   const name = req.headers.search;
//   const type = req.headers.type;
//   if (name) {
//     try {
//       const product = await Product.find();
//       const findData = product.filter((val) => {
//         return val.name.toLowerCase().includes(name.toLowerCase());
//       });
//       if (findData.length !== 0) {
//         const getLinit = findData.slice(page, page + limit);

//         return res.status(200).json({
//           success: true,
//           data: getLinit,
//           length: findData.length,
//         });
//       } else {
//         return res
//           .status(200)
//           .json({ success: false, state: "Input not found!" });
//       }
//     } catch (err) {
//       res.status(500).json({ success: false, state: "Something wrong!" });
//     }
//   }
//   //
//   else
//     if (type) {
//       try {
//         const product = await Product.find();
//         const findDataType = product.filter((val) => {
//           return val.type.toLowerCase().includes(type.toLowerCase());
//         });
//         if (findDataType.length !== 0) {
//           const getLinit = findDataType.slice(page, page + limit);
//           return res.status(200).json({
//             success: true,
//             data: getLinit,
//             length: findDataType.length,
//           });
//         } else {
//           return res
//             .status(200)
//             .json({ success: false, state: "Input not found!" });
//         }
//       } catch (err) {
//         res.status(500).json({ success: false, state: "Something wrong!" });
//       }
//     }
//     //
//     else {
//       try {
//         const lengthALLProduct = await Product.count();
//         const products = await Product.find().skip(page).limit(limit);
//         res.status(200).json({
//           success: true,
//           data: products,
//           length: lengthALLProduct,
//         });
//       } catch (err) {
//         res.status(500).json(err);
//       }
//     }
// };


//get all products

// exports.getAllProducts = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1; // Get the page number from the query string or default to page 1
//     const limit = parseInt(req.query.limit) || 10; // Get the limit from the query string or default to 10 items per page
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     const total = await Product.countDocuments();

//     const products = await Product.find().skip(startIndex).limit(limit);

//     const pagination = {};
//     if (endIndex < total) {
//       pagination.next = {
//         page: page + 1,
//         limit: limit,
//       };
//     }

//     if (startIndex > 0) {
//       pagination.prev = {
//         page: page - 1,
//         limit: limit,
//       };
//     }

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       pagination,
//       products,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// };