const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
    {
        prductId: {type: String, require: true},
        users: {
            type: Array,
            require: false,
        },
        rating: {type: Number, default: 0, Min: 0, Max: 5}
    },
    {
        timestamps: true,
        collection: "products",
    }
);
module.exports = mongoose.model("rating", RatingSchema);