import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { supplierDashboard } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/supplier", protect, supplierDashboard);

export default router;