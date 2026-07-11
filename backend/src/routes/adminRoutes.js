import express from "express";
import {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  getOrderById
} from "../controllers/adminController.js";


const router = express.Router();


router.get("/stats", getDashboardStats);

router.get("/orders", getAllOrders);

router.get("/users", getAllUsers);

router.get("/orders/:id", getOrderById);



export default router;