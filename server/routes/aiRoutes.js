import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { predictPrice } from "../controllers/aiController.js";

const router = express.Router();

router.post("/predict-price", protect, predictPrice);

export default router;