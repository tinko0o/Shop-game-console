const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        products: {
            type: Array,
            require: true,
        },
        total: {type: Number, require: true},
        name: {type: String, require: true},
        phone: {type: String, require: true},
        address: {type: String, require: true},
    },
    {
        timestamps: true,
        collection: "orders",
    }
);
module.exports = mongoose.model("order", OrderSchema);