const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");

//register

exports.register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const salt = await bcrypt.genSaltSync(12);
  hashedPassword = await bcrypt.hashSync(password, salt);
  console.log("hashedPassword:", hashedPassword);
  try {
    const user = new User({
      name,
      email,
      password: hashedPassword,
      // phone,
      // address,
    });
    await user.save();
    res.status(200).json({
      success: true,
      data: user,
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
      message: "Wrong password",
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
    const user = jwt.verify(token, key);
    if (user) {
      await User.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, state: "Some thing is wrong" });
  }
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
    const user = jwt.verify(token, key);
    if (user) {
      const { password, newPassword, confirmPassword } = req.body;
      if (!password || !newPassword || !confirmPassword) {
        return res.status(500).json({
          success: false,
          message: "Invalid Input",
        });
      }
      await User.findOne({ email });
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
          message: "Invalid User",
        });
      }
      const salt = await bcrypt.genSaltSync(12);
      hashedPassword = await bcrypt.hashSync(newPassword, salt);
      await user.update({ password: hashedPassword });
    }

  } catch (err) {
    res.status(500).json({ success: false, state: "Some thing is wrong" });
  }
};

//show user information

exports.showInformation = async (req, res) => {
  try {
    const token = req.headers.authentication;
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.JWT_SEC;
    const user = jwt.verify(token, key);
    await User.find(req.params.email);
    res.status(200).json({
      success: true,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    })
  } catch (err) {
    res.status(500).json({ success: false, state: "Some thing is wrong" });
  }
};

//get all users

exports.getAllUsers = async (req, res) => {
  try {
    const token = req.headers.authentication;
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Unauthorization",
      });
    }
    const key = process.env.JWT_SEC;
    const user = jwt.verify(token, key);
    await User.find();
    res.status(200).json(user);
  }
  catch (err) {
    res.status(500).json({ success: false, state: "Some thing is wrong" });
  }
};

//delete user

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.status(200).json({ success: true });
    console.log("Success");
  } catch (err) {
    res.status(500).json({ success: false, state: "invalid ID" });
  }
};