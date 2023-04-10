const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register

exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  console.log(name, email, password);
  if (!email || !password || !name) {
    return res.status(500).json({
      success: false,
      message: "Invalid Input",
    });
  }
  const salt = await bcrypt.genSaltSync(12);
  hashedPassword = await bcrypt.hashSync(password, salt);
  console.log("hashedPassword:", hashedPassword);
  try {
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: "Success"
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    console.log();
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: `${Object.keys(error.keyValue)} is already existed`,
      });
    }
  }
};

//login

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({
      success: false,
      message: "Invalid Input",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(500).json({
      success: false,
      message: "Invalid User",
    });
  }
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(500).json({
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
    user,
    token,
  });
};

//Change password

exports.changePassword = async (req, res) => {
  try {
    const token = req.headers.authentication;
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.JWT_SEC;
    const decoded = jwt.verify(token, key);
    const { password, newPassword, confirmPassword } = req.body;
    if (!password || !newPassword || !confirmPassword) {
      return res.status(500).json({
        success: false,
        message: "Invalid Input",
      });
    }
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Invalid User",
      });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(500).json({
        success: false,
        message: "invalid password",
      });
    }
    const salt = await bcrypt.genSaltSync(12);
    hashedPassword = await bcrypt.hashSync(newPassword, salt);
    await User.updateOne({ password: hashedPassword });
    res.status(200).json({
      success: true,
      message: "Success"
    });
  } catch (err) {
    res.status(500).json({ success: false, state: "Some thing is wrong" });
  }
};

//update user information

exports.updateUser = async (req, res) => {
  try {
    const token = req.headers.authentication;
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.JWT_SEC;
    const decoded = jwt.verify(token, key);
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Success"
    });
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    console.log();
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: `${Object.keys(error.keyValue)} is already existed`,
      });
    }
  }
};

//delete user



