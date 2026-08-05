import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const supplierDashboard = async (req, res) => {
  try {
    const supplierId = req.user._id;

    // ==========================
    // PRODUCTS
    // ==========================
    const totalProducts = await Product.countDocuments({
      supplier: supplierId,
    });

    const outOfStock = await Product.countDocuments({
      supplier: supplierId,
      stock: 0,
    });

    const lowStock = await Product.countDocuments({
      supplier: supplierId,
      stock: {
        $gt: 0,
        $lte: 10,
      },
    });

    // ==========================
    // ORDERS
    // ==========================
    const orders = await Order.find({
      supplier: supplierId,
    }).populate("buyer", "name");

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (o) => o.status === "Pending"
    ).length;

    const acceptedOrders = orders.filter(
      (o) => o.status === "Accepted"
    ).length;

    const packedOrders = orders.filter(
      (o) => o.status === "Packed"
    ).length;

    const shippedOrders = orders.filter(
      (o) => o.status === "Shipped"
    ).length;

    const deliveredOrders = orders.filter(
      (o) => o.status === "Delivered"
    ).length;

    const cancelledOrders = orders.filter(
      (o) => o.status === "Cancelled"
    ).length;

    // ==========================
    // REVENUE
    // ==========================
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // ==========================
    // RECENT ORDERS
    // ==========================
    const recentOrders = await Order.find({
      supplier: supplierId,
    })
      .populate("buyer", "name")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // ==========================
    // RESPONSE
    // ==========================
    res.json({
      success: true,

      dashboard: {
        totalProducts,

        totalOrders,

        totalRevenue,

        pendingOrders,

        acceptedOrders,

        packedOrders,

        shippedOrders,

        deliveredOrders,

        cancelledOrders,

        lowStock,

        outOfStock,
      },

      recentOrders,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};