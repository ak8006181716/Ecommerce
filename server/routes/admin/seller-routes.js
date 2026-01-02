const express = require("express");
const {
  createSeller,
  getAllSellers,
  getSellerOrders,
} = require("../../controllers/admin/seller-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Admin middleware - check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
  next();
};

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/create", createSeller);
router.get("/get", getAllSellers);
router.get("/orders/:sellerId", getSellerOrders);

module.exports = router;

