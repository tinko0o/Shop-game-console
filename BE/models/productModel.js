const mongoose =require("mongoose");
const Schema =mongoose.Schema;
const Product =new Schema
(
    {
          name: {
            type: String,
            require: true,
          },
          img: {
            type: String,
            require: true,
          },
          imgBg: {
            type: String,
            require: true,
          },
          type: {
            type: String,
            require: true,
          },
          company: {
            type: String,
            require: true,
          },
          detail: {
            type: String,
            require:true,
          },
          rating: {
            type: Number,
            require: true,
          },
          state: {
            type: String,
            require: true,
          },
          price: {
            type: Number,
            require: true,
          },
    },
    {
        timestamps: true,
        collection: "products",
        toJSON: {
          transform(doc, ret) {
            delete ret.__v;
          },
        },
    }
);
module.exports = mongoose.model("product",Product);