const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    phone: { type: String, require: true },
    city: { type: String, require: true },
    district: { type: String, require: true },
    wards: { type: String, require: true },
    streetAndHouseNumber: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "users",
  }
);
module.exports = mongoose.model("user", UserSchema);
