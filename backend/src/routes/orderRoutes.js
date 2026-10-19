import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered
} from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import { initializePaystackPayment, verifyPaystackPayment } from "../controllers/paystackController.js";

// Order routes include customer checkout history and admin fulfillment controls.
const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.get("/mine", protect, getMyOrders);
router.post("/:id/paystack/initialize", protect, initializePaystackPayment);
router.get("/paystack/verify", protect, verifyPaystackPayment);
router.route("/:id").get(protect, getOrderById);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

export default router;
