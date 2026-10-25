import mongoose from "mongoose";
import Product from "../models/Product.js";

const allowedFields = ["name", "category", "description", "price", "stock", "moq", "colors", "image", "status"];

export const addProduct = async (req, res) => {
  try {
    if (req.user.role !== "supplier") {
      return res.status(403).json({ success: false, message: "Only suppliers can add products" });
    }

    const { name, category, description, price, stock, moq, colors, image, status } = req.body;
    if (!name?.trim() || !category?.trim() || !description?.trim()) {
      return res.status(400).json({ success: false, message: "Name, category, and description are required" });
    }
    if (!Number.isFinite(Number(price)) || Number(price) <= 0 ||
        !Number.isInteger(Number(stock)) || Number(stock) < 0 ||
        (moq !== undefined && (!Number.isInteger(Number(moq)) || Number(moq) < 1))) {
      return res.status(400).json({ success: false, message: "Enter a valid price, stock, and minimum order quantity" });
    }

    const product = await Product.create({
      name: name.trim(), category: category.trim(), description: description.trim(),
      price: Number(price), stock: Number(stock), moq: moq === undefined ? 1 : Number(moq),
      colors, image, status: stock > 0 ? (status || "Available") : "Out of Stock",
      supplier: req.user._id,
    });
    return res.status(201).json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Please check the product details" });
    }
    return res.status(500).json({ success: false, message: "Unable to add product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, category, maxPrice, stock } = req.query;
    const filter = {};

    if (search?.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: escaped, $options: "i" };
    }
    if (category && category !== "All") filter.category = category;
    if (maxPrice !== undefined && maxPrice !== "") {
      const parsedPrice = Number(maxPrice);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({ success: false, message: "Invalid maxPrice filter" });
      }
      filter.price = { $lte: parsedPrice };
    }
    if (stock === "available") filter.stock = { $gt: 0 };

    const products = await Product.find(filter).populate("supplier", "name businessName");
    return res.json({ success: true, products });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load products" });
  }
};

export const getProduct = async (req, res) => getProductById(req, res);

export const getProductById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }
    const product = await Product.findById(req.params.id).populate("supplier", "name businessName");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.json({ success: true, product });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "supplier") {
      return res.status(403).json({ success: false, message: "Only suppliers can update products" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }
    const product = await Product.findOne({ _id: req.params.id, supplier: req.user._id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found or access denied" });

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) product.set(field, req.body[field]);
    }
    if (product.price <= 0 || product.stock < 0 || !Number.isInteger(Number(product.stock)) ||
        product.moq < 1 || !Number.isInteger(Number(product.moq))) {
      return res.status(400).json({ success: false, message: "Enter valid price, stock, and minimum order quantity" });
    }
    product.status = product.stock > 0 ? (req.body.status || product.status || "Available") : "Out of Stock";
    await product.save();
    return res.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Please check the product details" });
    return res.status(500).json({ success: false, message: "Unable to update product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "supplier") {
      return res.status(403).json({ success: false, message: "Only suppliers can delete products" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }
    const product = await Product.findOneAndDelete({ _id: req.params.id, supplier: req.user._id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found or access denied" });
    return res.json({ success: true, message: "Product deleted successfully" });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to delete product" });
  }
};
