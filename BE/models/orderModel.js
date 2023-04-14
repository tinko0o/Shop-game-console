const mongoose = require("mongoose");

const OrdderSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        products: {
            type: Array,
            require: true,
        },

    },
    {
        timestamps: true,
        collection: "orders",
    }
);
module.exports = mongoose.model("order", UserSchema);