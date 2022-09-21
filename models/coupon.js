const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    maxPrice: {
      type: Number,
      required: true,
    },
    minPrice: {
      type: Number,
      required: true,
    },
    offerPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    // couponCode: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    expiryDate: {
      type: Date,
      required: true,
        },
    startDate: {
            type: Date,
            required: true,
    },
    couponCodes:{
      type:Array
    }
    // isActive: {
    //   type: Boolean,
    //   require: true,
    //   default: true,
    // },
  },
  { timestamps: true, collection: "coupon" }
);
module.exports = mongoose.model("coupon", couponSchema);
 