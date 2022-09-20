const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    graterPrice: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    expiryDate: {
      type: Date,
      required: true,
      unique: true,
        },
    startDate: {
            type: Date,
            required: true,
            unique: true,
    },
    isActive: {
      type: Boolean,
      require: true,
      default: true,
    },
  },
  { timestamps: true, collection: "coupon" }
);
module.exports = mongoose.model("coupon", couponSchema);
 