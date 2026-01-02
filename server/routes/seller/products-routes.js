const express = require("express");
const {
  addProduct,
  getSellerProducts,
  deleteProduct,
  updateProduct,
  handleImageUpload,
} = require("../../controllers/seller/products-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { upload } = require("../../helpers/cloudinary");

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

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.get("/get", getSellerProducts);
router.delete("/delete/:id", deleteProduct);
router.put("/edit/:id", updateProduct);

module.exports = router;

