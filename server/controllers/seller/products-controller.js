const Product = require("../../models/Product");
const { imageUploadUtil } = require("../../helpers/cloudinary");

// Add a new product (seller only)
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const sellerId = req.user.id; // Get seller ID from authenticated user

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview: averageReview || 0,
      sellerId,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
      message: "Product added successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occurred while adding product",
    });
  }
};

// Get all products for the logged-in seller
const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.find({ sellerId });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching products",
    });
  }
};

// Delete a product (seller can only delete their own products)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the product belongs to this seller
    if (product.sellerId !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting product",
    });
  }
};

// Update a product (seller can only update their own products)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;
    const sellerId = req.user.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the product belongs to this seller
    if (product.sellerId !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.price = price === "" ? 0 : price || product.price;
    product.salePrice = salePrice === "" ? 0 : salePrice || product.salePrice;
    product.totalStock = totalStock || product.totalStock;
    product.image = image || product.image;
    product.averageReview = averageReview !== undefined ? averageReview : product.averageReview;

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occurred while updating product",
    });
  }
};

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error occurred",
    });
  }
};

module.exports = {
  addProduct,
  getSellerProducts,
  deleteProduct,
  updateProduct,
  handleImageUpload,
};

