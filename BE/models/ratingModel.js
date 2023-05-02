const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
    {
        productId: {type: String, require: true},
        users: {
            type: Array,
            require: false,
        },
        avgRating: {type: Number, default: 0.0},
        totalRating: {type: Number, default: 0}
    },
    {
        timestamps: true,
        collection: "ratings",
    }
);
module.exports = mongoose.model("rating", RatingSchema);