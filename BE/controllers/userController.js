const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const ejs = require('ejs');
const fs = require('fs');

//register

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Thiếu các trường bắt buộc',
      },
    });
  }

  const salt = await bcrypt.genSaltSync(12);
  const hashedPassword = await bcrypt.hashSync(password, salt);

  try {
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });

    await user.save();

    const verificationLink = `http://localhost:8080/api/users/user/verifyEmail?token=${verificationToken}`;

    const mailOptions = {
      from: 'manhha2392000@gmail.com',
      to: user.email,
      subject: 'Xác minh địa chỉ email',
      text: `Xin chào,\n\nVui lòng nhấp vào liên kết sau để xác minh địa chỉ email của bạn:\n\n${verificationLink}\n\nTrân trọng,\nNhóm hỗ trợ của chúng tôi`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công, vui lòng xác nhận email',
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    console.log();
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: {
          message: 'Email đã tồn tại',
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          message: 'Đã xảy ra sự cố khi tạo tài khoản',
        },
      });
    }
  }
};

// verify email
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        const template = fs.readFileSync('views/verify-fail.ejs', 'utf-8');
        const html = ejs.render(template);
        return res.status(404).send(html);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Đọc nội dung của file template verify-email.ejs
    const template = fs.readFileSync('views/verify-email.ejs', 'utf-8');

    // Render template với dữ liệu cần truyền vào (nếu có)
    const html = ejs.render(template, { username: user.name });

    // Trả về HTML đã render
    res.status(200).send(html);
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    console.log();

    res.status(500).json({
      success: false,
      error: {
        message: 'Đã xảy ra sự cố khi xác minh email',
      },
    });
  }
};
// exports.verifyEmail = async (req, res) => {
//   const { token } = req.query;

//   try {
//     const user = await User.findOne({ verificationToken: token });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'Không tìm thấy người dùng',
//       });
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: 'Email xác minh thành công',
//     });
//   } catch (error) {
//     console.log(JSON.stringify(error, null, 2));
//     console.log();

//     res.status(500).json({
//       success: false,
//       error: {
//         message: 'Đã xảy ra sự cố khi xác minh email',
//       },
//     });
//   }
// };

// Resend verification email

exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email không được bỏ trống',
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản đã được xác minh',
      });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const verificationLink = `http://localhost:8080/api/users/user/verifyEmail?token=${verificationToken}`;

    const mailOptions = {
      from: 'manhha2392000@gmail.com',
      to: user.email,
      subject: 'Xác minh địa chỉ email',
      text: `Xin chào,\n\nVui lòng nhấp vào liên kết sau để xác minh địa chỉ email của bạn:\n\n${verificationLink}\n\nTrân trọng,\nNhóm hỗ trợ của chúng tôi`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Gửi lại email xác minh thành công',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra sự cố khi gửi lại email xác minh',
    });
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

    if(!user.isVerified)
    {
      return res.status(401).json({
        success: false,
        message: "Tài khoản chưa được xác minh, vui lòng check email để xác minh",
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


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "manhha2392000@gmail.com",
    pass: "devrvqmuqvfufgds",
  },
});


// forget password

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();

    const mailOptions = {
      from: "manhha2392000@gmail.com",
      to: user.email,
      subject: "Đặt lại mật khẩu",
      text: `Xin chào,\n\nBạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã sau để đặt lại mật khẩu của bạn:\n\n${resetToken}\n\nMã này sẽ hết hạn sau 1 giờ.\n\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\nTrân trọng,\nNhóm hỗ trợ của chúng tôi`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Một email đã được gửi đến bạn để đặt lại mật khẩu.",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Đã xảy ra sự cố khi yêu cầu đặt lại mật khẩu" });
  }
};

// reset password

exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, password, confirmPassword } = req.body;

    const user = await User.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu xác nhận không trùng",
      });
    }

    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Mật khẩu đã được đặt lại thành công.",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Đã xảy ra sự cố khi đặt lại mật khẩu" });
  }
};



