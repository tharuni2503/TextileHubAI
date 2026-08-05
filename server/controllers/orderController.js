import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// =======================
// PLACE ORDER
// =======================
export const placeOrder = async (req, res) => {
  try {
    console.log("========== ORDER ==========");
    console.log("Logged in User:", req.user);

    const cart = await Cart.find({
      user: req.user._id,
    }).populate("product");

    if (cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const validCart = cart.filter((item) => item.product);

    if (validCart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid products found",
      });
    }

    // Check stock availability
    for (const item of validCart) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} has only ${item.product.stock} items in stock.`,
        });
      }
    }

    const items = validCart.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const supplier = validCart[0].product.supplier;

    console.log("Creating Order...");
    console.log({
      buyer: req.user._id,
      supplier,
      items,
      totalAmount,
    });

    // Create Order
    const order = await Order.create({
      buyer: req.user._id,
      supplier,
      items,
      totalAmount,
    });

    // ==========================
    // UPDATE PRODUCT STOCK
    // ==========================
    for (const item of validCart) {
      const product = await Product.findById(item.product._id);

      if (product) {
        product.stock -= item.quantity;

        if (product.stock <= 0) {
          product.stock = 0;
          product.status = "Out of Stock";
        } else {
          product.status = "Available";
        }

        await product.save();
      }
    }

    // Clear Cart
    await Cart.deleteMany({
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// BUYER ORDERS
// =======================
export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyer: req.user._id,
    })
      .populate("items.product")
      .populate("supplier", "name businessName");

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// SUPPLIER ORDERS
// =======================
export const getSupplierOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      supplier: req.user._id,
    })
      .populate("buyer", "name email")
      .populate("items.product");

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// UPDATE ORDER STATUS
// =======================
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        returnDocument: "after",
      }
    );

    res.json({
      success: true,
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// CANCEL ORDER
// =======================
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order belongs to the buyer
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order",
      });
    }

    // Check if order can be cancelled (match your schema enum)
    const cancellableStatuses = ["Pending", "Accepted", "Packed", "Shipped"];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled. Current status: ${order.status}`,
      });
    }

    // Update order status to cancelled
    order.status = "Cancelled";
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        if (product.stock > 0) {
          product.status = "Available";
        }
        await product.save();
      }
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};