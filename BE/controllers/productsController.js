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
    const { name, manufacturer, type, release_date, description, price, img } = req.body
    if(!name || !manufacturer || !type || !release_date || !description || !price || !img)
    {
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
    if(!product)
    {
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
    if(!product)
    {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

//get all product

//hàm này đã có chức năng phân trang và sắp xếp theo options: price, name, manufacturer,....
// get products?page=1&limit=10&sort=price,.....

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "-createdAt";
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const products = await Product.find()
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .exec();

    const total = await Product.countDocuments();

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    };

    return res.status(200).json({
      success: true,
      data: products,
      pagination: pagination,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//search for a product

// get products/searchedProducts/search?name=....
// get products/searchedProducts/search?name=....&type=....
// get products/searchedProducts/search?name=....&type=....&manufacturer=....

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

// exports.getProducts = async (req, res) => {
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