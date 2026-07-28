const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
} = require("../../controllers/common/feature-controller");
const { seedProducts } = require("../../controllers/common/seed-controller");

const router = express.Router();

const { authMiddleware } = require("../../controllers/auth/auth-controller");

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

router.post("/add", authMiddleware, adminMiddleware, addFeatureImage);
router.get("/get", getFeatureImages);
router.get("/seed-products", seedProducts);

module.exports = router;
