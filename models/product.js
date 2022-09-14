const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    image: {
      type: Array,
    },
    active: {
      type: Boolean,
      default: false,
    },
    noSqlMode: {
      type: String,
      default: "1",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);
