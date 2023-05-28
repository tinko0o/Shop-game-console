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
        message: "Thiếu các trường bắt buộc",
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
      message: "Đăng ký tài khoản thành công",
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    console.log();
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: {
          message: "Email đã tồn tại",
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          message: "Đã xảy ra sự cố khi tạo tài khoản",
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
      message: "không hợp lệ",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Không tìm tài khoản",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Sai mật khẩu",
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
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố khi đăng nhập" });
  }
};

//Change password

exports.changePassword = async (req, res) => {
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
    const { password, newPassword, confirmPassword } = req.body;
    if (!password || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Không hợp lệ",
      });
    }
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        success: false,
        message: "Sai mật khẩu",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu xác nhận không trùng",
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
      message: "Cập nhật mật khẩu thành công",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố khi cập nhật mật khẩu" });
  }
};

//update user information

exports.updateUser = async (req, res) => {
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
    const { phone, city, district, wards,  streetAndHouseNumber } = req.body;
    // if (!name ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid input",
    //   });
    // }
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email }, 
      { phone, city, district, wards, streetAndHouseNumber},
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra sự cố khi cập nhật thông tin",
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
        message: "Không được phép",
      });
    }
    const key = process.env.JWT_SEC;
    const decoded = jwt.verify(token, key);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      })
    }
    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố xuất thông tin chi tiết tài khoản" });
  }
};

//get all users

exports.getAllUsers = async (req, res) => {
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
    const users = await User.find({ email: { $ne: decoded.email },isAdmin: false});
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố xuất thông tin người dùng" });
  }
};

//get user when is admin

exports.getUserWhenAdmin = async (req, res) => {
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
    const userFound = await User.findById(req.params.id);
    if(!userFound)
    {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      })
    }
    return res.status(200).json({
      success: true,
      data: userFound,
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố khi xuất thông tin chi tiết người dùng" });
  }
};

//edit user

exports.editUser = async (req, res) => {
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
    const user = await User.findOne({email: decoded.email});
    if(!user.isAdmin)
    {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền",
      });
    }
    const { name, phone, city, district, wards,  streetAndHouseNumber } = req.body;
    if (!name ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { name, phone, city, district, wards, streetAndHouseNumber},
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cập nhật người dùng thành công",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra sự cố khi cập nhật người dùng",
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
    const deletedUser = await User.findByIdAndDelete({ _id: req.params.id });
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }
    return res.status(200).json({ success: true, message: "Xóa người dùng thành công" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Đă xảy ra sự cố khi xóa người dùng" });
  }
};


// change password admin
exports.changeAdminPassword = async (req, res) => {
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
    if (!user && !user.isAdmin) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản admin",
      })
    }
    const { password, newPassword, confirmPassword } = req.body;
    if (!password || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Không hợp lệ",
      });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        success: false,
        message: "Sai mật khẩu",
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu xác nhận không trùng",
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
      message: "Cập nhật mật khẩu cho admin thành công",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Đã xảy ra sự cố khi cập nhật mật khẩu cho admin" });
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
