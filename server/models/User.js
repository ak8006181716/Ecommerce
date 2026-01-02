const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  businessType: {
    type: String,
    default: null,
  },
  mobileNumber: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
