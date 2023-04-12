const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: String, require: true, },
  products: [{
    prductId:{
        type:String
    },
    quantity:{
        type: Number,
        default: 1,
    },
  }]
},
  {
    timestamps: true,
    collection: "carts",
  }
);
module.exports = mongoose.model("cart", CartSchema);