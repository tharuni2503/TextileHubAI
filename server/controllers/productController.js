import Product from "../models/Product.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      supplier: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const { search, category, maxPrice, stock } = req.query;

    let filter = {};

    // Search by name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Category filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Price filter
    if (maxPrice) {
      filter.price = {
        $lte: Number(maxPrice),
      };
    }

    // Stock filter
    if (stock === "available") {
      filter.stock = {
        $gt: 0,
      };
    }

    const products = await Product.find(filter).populate(
      "supplier",
      "name businessName"
    );

    res.json({
      success: true,
      products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "supplier",
      "name businessName"
    );

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Product Updated",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};