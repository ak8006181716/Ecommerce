const Product = require("../../models/Product");
const Order = require("../../models/Order");

// Get all orders for the logged-in seller
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Get all products by this seller
    const sellerProducts = await Product.find({ sellerId: sellerId });
    const productIds = sellerProducts.map((p) => p._id.toString());

    // Get all orders
    const allOrders = await Order.find({});

    // Filter orders that contain products from this seller
    const sellerOrders = allOrders.filter((order) => {
      return order.cartItems.some((item) =>
        productIds.includes(item.productId)
      );
    });

    // Enrich orders with seller-specific product details
    const enrichedOrders = sellerOrders.map((order) => {
      const sellerItems = order.cartItems.filter((item) =>
        productIds.includes(item.productId)
      );
      const sellerOrderTotal = sellerItems.reduce((sum, item) => {
        return sum + parseFloat(item.price) * item.quantity;
      }, 0);

      return {
        ...order.toObject(),
        sellerItems,
        sellerOrderTotal,
      };
    });

    res.status(200).json({
      success: true,
      data: enrichedOrders,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching orders",
    });
  }
};

// Get order details for a specific order
const getSellerOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Get all products by this seller
    const sellerProducts = await Product.find({ sellerId: sellerId });
    const productIds = sellerProducts.map((p) => p._id.toString());

    // Filter cart items that belong to this seller
    const sellerItems = order.cartItems.filter((item) =>
      productIds.includes(item.productId)
    );

    if (sellerItems.length === 0) {
      return res.status(403).json({
        success: false,
        message: "This order does not contain your products",
      });
    }

    const sellerOrderTotal = sellerItems.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);

    res.status(200).json({
      success: true,
      data: {
        ...order.toObject(),
        sellerItems,
        sellerOrderTotal,
      },
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching order details",
    });
  }
};

module.exports = {
  getSellerOrders,
  getSellerOrderDetails,
};

