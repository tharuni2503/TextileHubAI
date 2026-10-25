import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const requestedQuantity = Number(quantity);

    if (!mongoose.isValidObjectId(productId) || !Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ success: false, message: "Choose a valid product and quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (product.supplier?.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot buy your own product" });
    }
    if (product.stock < requestedQuantity) {
      return res.status(400).json({ success: false, message: "Requested quantity exceeds available stock" });
    }

    const existing = await Cart.findOne({ user: req.user._id, product: productId });
    const newQuantity = (existing?.quantity || 0) + requestedQuantity;
    if (newQuantity > product.stock) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items are available` });
    }

    if (existing) {
      existing.quantity = newQuantity;
      await existing.save();
    } else {
      await Cart.create({ user: req.user._id, product: productId, quantity: requestedQuantity });
    }
    return res.json({ success: true, message: existing ? "Cart updated" : "Added to cart" });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to update cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user._id }).populate("product");
    return res.json({ success: true, cart });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load cart" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid cart item ID" });
    }
    const removed = await Cart.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!removed) return res.status(404).json({ success: false, message: "Cart item not found" });
    return res.json({ success: true, message: "Removed from cart" });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to remove cart item" });
  }
};
