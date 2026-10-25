import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  const reserved = [];
  let createdOrder = null;
  try {
    if (req.user.role !== "buyer") {
      return res.status(403).json({ success: false, message: "Only buyers can place orders" });
    }

    const address = req.body?.shippingAddress;
    const paymentMethod = req.body?.paymentMethod || "COD";
    if (!address || !["fullName", "phone", "address", "city", "pincode"].every((field) =>
      typeof address[field] === "string" && address[field].trim())) {
      return res.status(400).json({ success: false, message: "A complete shipping address is required" });
    }
    if (!/^\d{10}$/.test(address.phone.replace(/\D/g, "")) ||
        !/^\d{6}$/.test(address.pincode.trim())) {
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit phone number and 6-digit pincode" });
    }
    if (paymentMethod !== "COD") {
      return res.status(400).json({ success: false, message: "Currently only Cash on Delivery is supported" });
    }

    const cart = await Cart.find({ user: req.user._id }).populate("product");
    const validCart = cart.filter((item) => item.product);
    if (!validCart.length) {
      return res.status(400).json({ success: false, message: "Cart is empty or contains unavailable products" });
    }
    if (validCart.some((item) => !Number.isInteger(item.quantity) || item.quantity < 1)) {
      return res.status(400).json({ success: false, message: "Cart contains an invalid quantity" });
    }

    const supplierIds = new Set(validCart.map((item) => String(item.product.supplier)));
    if (supplierIds.size !== 1) {
      return res.status(400).json({
        success: false,
        message: "Please order from one supplier at a time. Remove items from other suppliers and check out separately.",
      });
    }

    const items = validCart.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const supplier = validCart[0].product.supplier;

    // Atomically reserve stock so concurrent checkouts cannot oversell.
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        [{ $set: { stock: { $subtract: ["$stock", item.quantity] } } }],
        { new: true }
      );
      if (!updated) {
        throw Object.assign(new Error("One or more products no longer have enough stock. Refresh your cart and try again."), { statusCode: 409 });
      }
      if (updated.stock <= 0) {
        updated.status = "Out of Stock";
      } else {
        updated.status = "Available";
      }
      await updated.save();
      reserved.push(item);
    }

    createdOrder = await Order.create({
      buyer: req.user._id,
      supplier,
      items,
      totalAmount,
      shippingAddress: {
        fullName: address.fullName.trim(),
        phone: address.phone.trim(),
        address: address.address.trim(),
        city: address.city.trim(),
        pincode: address.pincode.trim(),
        landmark: typeof address.landmark === "string" ? address.landmark.trim() : "",
      },
      paymentMethod,
    });

    await Cart.deleteMany({ user: req.user._id });
    return res.status(201).json({ success: true, message: "Order placed successfully", order: createdOrder });
  } catch (error) {
    // Compensate stock reservations if order creation did not complete.
    if (!createdOrder && reserved.length) {
      await Promise.all(reserved.map(async (item) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          product.status = product.stock > 0 ? "Available" : "Out of Stock";
          await product.save();
        }
      })).catch((rollbackError) => console.error("Stock rollback failed:", rollbackError.message));
    }
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Please check your shipping and order details" });
    console.error("Place order failed:", error.message);
    return res.status(500).json({ success: false, message: "Unable to place order. Please try again." });
  }
};

export const getBuyerOrders = async (req, res) => {
  try {
    if (req.user.role !== "buyer") return res.status(403).json({ success: false, message: "Buyer account required" });
    const orders = await Order.find({ buyer: req.user._id })
      .populate("items.product")
      .populate("supplier", "name businessName");
    return res.json({ success: true, orders });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load buyer orders" });
  }
};

export const getSupplierOrders = async (req, res) => {
  try {
    if (req.user.role !== "supplier") return res.status(403).json({ success: false, message: "Supplier account required" });
    const orders = await Order.find({ supplier: req.user._id })
      .populate("buyer", "name email")
      .populate("items.product");
    return res.json({ success: true, orders });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load supplier orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "supplier") return res.status(403).json({ success: false, message: "Supplier account required" });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid order ID" });

    const allowedStatuses = ["Accepted", "Packed", "Shipped", "Delivered"];
    if (!allowedStatuses.includes(req.body?.status)) {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }
    const order = await Order.findOne({ _id: req.params.id, supplier: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found or access denied" });
    if (order.status === "Cancelled" || order.status === "Delivered") {
      return res.status(400).json({ success: false, message: "This order can no longer be updated" });
    }
    const transitions = {
      Pending: ["Accepted"],
      Accepted: ["Packed"],
      Packed: ["Shipped"],
      Shipped: ["Delivered"],
    };
    if (!transitions[order.status]?.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: `Cannot change order from ${order.status} to ${req.body.status}` });
    }
    order.status = req.body.status;
    await order.save();
    return res.json({ success: true, order });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to update order status" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    if (req.user.role !== "buyer") return res.status(403).json({ success: false, message: "Buyer account required" });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid order ID" });
    const order = await Order.findOne({ _id: req.params.id, buyer: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!["Pending", "Accepted"].includes(order.status)) {
      return res.status(400).json({ success: false, message: "Orders can only be cancelled before packing" });
    }

    // Claim the cancellation with a conditional update to prevent repeated stock restoration.
    const cancelled = await Order.findOneAndUpdate(
      { _id: order._id, buyer: req.user._id, status: order.status },
      { $set: { status: "Cancelled" } },
      { new: true }
    );
    if (!cancelled) return res.status(409).json({ success: false, message: "Order status changed; refresh and try again" });

    for (const item of cancelled.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        product.status = "Available";
        await product.save();
      }
    }
    return res.json({ success: true, message: "Order cancelled successfully", order: cancelled });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to cancel order" });
  }
};
