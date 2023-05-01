const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        products: {
            type: Array,
            require: true,
        },
        total: {type: Number, default: 0},
    },
    {
        timestamps: true,
        collection: "carts",
    }
);
module.exports = mongoose.model("cart", CartSchema);