const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    phone: { type: String, require: true },
    address: { type: String, require: true },
    isAdmin: { type: Boolean, default: false},
},
    {
        timestamps: true,
        collection: "users"
    }
);
module.exports = mongoose.model("user", UserSchema);