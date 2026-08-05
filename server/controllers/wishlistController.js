import Wishlist from "../models/Wishlist.js";

export const addWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const exist = await Wishlist.findOne({
      user: req.user._id,
      product: productId,
    });

    if (exist) {
      return res.json({
        success: true,
        message: "Already in wishlist",
      });
    }

    await Wishlist.create({
      user: req.user._id,
      product: productId,
    });

    res.json({
      success: true,
      message: "Added to Wishlist",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user._id,
    }).populate("product");

    res.json({
      success: true,
      wishlist,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const removeWishlist = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);

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