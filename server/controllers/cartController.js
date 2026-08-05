import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const userId = req.user._id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existing = await Cart.findOne({
      user: userId,
      product: productId,
    });

    if (existing) {
      existing.quantity += quantity;

      await existing.save();

      return res.json({
        success: true,
        message: "Cart Updated",
      });
    }

    await Cart.create({
      user: userId,
      product: productId,
      quantity,
    });

    res.json({
      success: true,
      message: "Added to Cart",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.user._id,
    }).populate("product");

    res.json({
      success: true,
      cart,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {

    await Cart.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Removed",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};