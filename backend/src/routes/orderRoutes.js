import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderToPaid
} from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

// Order routes include customer checkout history and admin fulfillment controls.
const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.get("/mine", protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
// A payment provider webhook should replace this route before taking live payments.
router.put("/:id/pay", protect, admin, updateOrderToPaid);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

export default router;
