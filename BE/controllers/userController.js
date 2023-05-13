const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");

//register

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Missing required fields",
      },
    });
  }
  const salt = await bcrypt.genSaltSync(12);
  const hashedPassword = await bcrypt.hashSync(password, salt);
  try {
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    console.log();
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: {
          message: "Email is already taken",
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          message: "Something went wrong",
        },
      });
    }
  }
};

//login

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Invalid Input",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid User",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const key = process.env.JWT_SEC;
    const token = await jwt.sign(
      {
        email: user.email,
        username: user.username,
      },
      key,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      data: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Change password

exports.changePassword = async (req, res) => {
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
    const { password, newPassword, confirmPassword } = req.body;
    if (!password || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid Input",
      });
    }
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm passwords do not match",
      });
    }
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email },
      { password: hashedPassword },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//update user information

exports.updateUser = async (req, res) => {
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
    const { name, phone, city, district, wards,  streetAndHouseNumber } = req.body;
    if (!name ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email }, 
      { phone, city, district, wards, streetAndHouseNumber},
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//get user

exports.getUser = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//get all users

exports.getAllUsers = async (req, res) => {
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
    const users = await User.find({ email: { $ne: decoded.email },isAdmin: false});
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//get user when is admin

exports.getUserWhenAdmin = async (req, res) => {
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
    const userFound = await User.findById(req.params.id);
    if(!userFound)
    {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    return res.status(200).json({
      success: true,
      data: userFound,
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//edit user

exports.editUser = async (req, res) => {
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
    const user = await User.findOne({email: decoded.email});
    if(!user.isAdmin)
    {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    const { name, phone, city, district, wards,  streetAndHouseNumber } = req.body;
    if (!name ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email }, 
      { phone, city, district, wards, streetAndHouseNumber},
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: editedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//delete user

exports.deleteUser = async (req, res) => {
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
    const deletedUser = await User.findByIdAndDelete({ _id: req.params.id });
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "An error occurred while deleting user" });
  }
};

// CODE YOU, YOU TỰ FIX VÀ TỰ GẮN

//check Admin
// exports.checkAuthorization =async (req,res)=>{
//   try{
//     const token = req.headers.authentication;
//     if(!token){
//       return res.status(200).JSON({
//         success:false,
//         message:"UnAuthorization"
//       });
//     }
//     const key =process.env.JWT_SEC;
//     const user = jwt.verify(token,key);
//     const email = user.email;
//     if(user){
//       const users = await User.findOne({email});
//       res.status(200).json({
//         success:true,
//         data: users.isAdmin,
//       });
//     }else{
//       res.status(200).json({
//         success:false,
//         message:"UnAuthorization"
//       });
//     }
//   }
//   catch(err){
//     res.status(500).json({
//       success:false,
//       state:"UnAuthorization",
//     });
//   }
// };
