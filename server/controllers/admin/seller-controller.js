const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const bcrypt = require("bcryptjs");

// Create a new seller (admin only)
const createSeller = async (req, res) => {
  try {
    const { userName, email, password, businessType, mobileNumber } = req.body;

    // Check if user already exists
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email!",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newSeller = new User({
      userName,
      email,
      password: hashPassword,
      role: "seller",
      businessType: businessType || null,
      mobileNumber: mobileNumber || null,
    });

    await newSeller.save();
    res.status(201).json({
      success: true,
      message: "Seller created successfully",
      data: {
        id: newSeller._id,
        userName: newSeller.userName,
        email: newSeller.email,
        role: newSeller.role,
        businessType: newSeller.businessType,
        mobileNumber: newSeller.mobileNumber,
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occurred while creating seller",
    });
  }
};

// Get all sellers
const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      data: sellers,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching sellers",
    });
  }
};

// Get seller orders count and details
const getSellerOrders = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Get all products by this seller
    const sellerProducts = await Product.find({ sellerId: sellerId });
    const productIds = sellerProducts.map((p) => p._id.toString());

    // Get all orders that contain products from this seller
    const allOrders = await Order.find({});
    
    const sellerOrders = allOrders.filter((order) => {
      return order.cartItems.some((item) =>
        productIds.includes(item.productId)
      );
    });

    // Calculate total orders count and total revenue
    const totalOrders = sellerOrders.length;
    const totalRevenue = sellerOrders.reduce((sum, order) => {
      return sum + (order.totalAmount || 0);
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        sellerId,
        totalOrders,
        totalRevenue,
        orders: sellerOrders,
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching seller orders",
    });
  }
};

module.exports = {
  createSeller,
  getAllSellers,
  getSellerOrders,
};

