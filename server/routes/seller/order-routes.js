const express = require("express");
const {
  getSellerOrders,
  getSellerOrderDetails,
} = require("../../controllers/seller/order-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Seller middleware - check if user is seller
const sellerMiddleware = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Seller only.",
    });
  }
  next();
};

// All routes require authentication and seller role
router.use(authMiddleware);
router.use(sellerMiddleware);

router.get("/get", getSellerOrders);
router.get("/details/:id", getSellerOrderDetails);

module.exports = router;

