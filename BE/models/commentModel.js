const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        productId: { tpye: String, require: true },
        users: {
            type: Array,
            require: false,
        },
        parentComment: {type: String, require: false},
    },
    {
        timestamps: true,
        collection: "comments",
    }
);

module.exports = mongoose.model("comment", CommentSchema);