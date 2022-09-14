const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
    },
    lname: { type: String },
    email: { type: String, required: true },
    phone_number: { type: String },
    password: { type: String, required: true },
  },
  { collection: 'admin' }
);
module.exports = mongoose.model('admin',adminSchema)