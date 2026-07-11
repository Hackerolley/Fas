import express from "express";
import {
  getDashboardStats,
  getAllOrders,
  getAllUsers
} from "../controllers/adminController.js";


const router = express.Router();


router.get("/stats", getDashboardStats);

router.get("/orders", getAllOrders);

router.get("/users", getAllUsers);


export default router;