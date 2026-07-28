const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_TIyzNkkcytEawu",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "ftLS1cYcfyEYSfc3KFaFgOwX",
});

module.exports = razorpayInstance;
