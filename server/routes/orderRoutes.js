import express from "express";

import {
  placeOrder,
  getBuyerOrders,
  getSupplierOrders,
  updateOrderStatus,
  cancelOrder, // 👈 Add this import
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);

router.get("/buyer", protect, getBuyerOrders);

router.get("/supplier", protect, getSupplierOrders);

// Update order status - changed to PATCH to avoid conflict
router.patch("/:id", protect, updateOrderStatus);

// 👇 ADD THIS NEW ROUTE - Cancel Order
router.put("/:id/cancel", protect, cancelOrder);

export default router;