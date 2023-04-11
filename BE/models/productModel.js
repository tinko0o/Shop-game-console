const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, require: true, },
  manufacturer: { type: String, require: true, },
  type: { type: String, require: true },
  release_date: { type: Date, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true, },
  img: { type: String, require: true, },
},
  {
    timestamps: true,
    collection: "products",
  }
);
module.exports = mongoose.model("product", ProductSchema);