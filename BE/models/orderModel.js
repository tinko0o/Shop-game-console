const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        products: {
            type: Array,
            require: true,
        },
        total: { type: Number, require: true },
        name: { type: String, require: true },
        phone: { type: String, require: true },
        city: { type: String, require: true },
        district: { type: String, require: true },
        wards: { type: String, require: true },
        streetAndHouseNumber: { type: String, require: true },
        address: { type: String, require: true },
        methods: { type: String, require: true },
        status: { type: String, require: true, },
    },
    {
        timestamps: true,
        collection: "orders",
    }
);

module.exports = mongoose.model("order", OrderSchema);