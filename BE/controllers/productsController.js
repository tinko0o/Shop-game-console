const Product = require("../models/productModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.addProduct = async (req,res)=>{
    try{
        const token = req.headers.authentication;
        if(!token){
            return res.status(200).json({
                success:false,
                message:"Unauthorrization",
            });
        }
        const key = process.env.JWT_SEC;
        const user = jwt.verify(token,key);
        const users = await User.findOne({email:user.email});
        if(users  && users.isAdmin >0){
            const {name, img, imgBg,type,company, detail, state, price, rating}=req.body;
            const product = new Product({
                name,
                img,
                imgBg,
                type,
                company,
                detail,
                state,
                price,
                rating,
              });
              await product.save();
              const getAllProduct = await Product.find();
              
              res.status(200).json({
                success: true,
                data: getAllProduct,
              });
        } else {
            res.status(200).json({
              success: false,
              message: "Unauthorization",
            });
          }
    }
    catch(error){
        console.log(JSON.stringify(error, null, 2));
        res.status(500).json({ state: "can't add product" });
    }
}
