import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import { getAllOrders } from "../controllers/adminController.js";

const router = express.Router();
router.get("/stats", getDashboardStats);
router.get("/orders", getAllOrders);

export default router;