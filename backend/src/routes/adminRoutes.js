import express from "express";
import {
  getDashboardStats,
  getAllOrders,
  getAllUsers,
  getOrderById,
  updateOrderStatus
} from "../controllers/adminController.js";
import { createBlog, deleteBlog, getAdminBlogs, updateBlog } from "../controllers/blogController.js";
import { createAdvertisement, deleteAdvertisement, getAdminAdvertisements, updateAdvertisement } from "../controllers/advertisementController.js";
import { admin, protect } from "../middleware/authMiddleware.js";


const router = express.Router();

// Every dashboard endpoint is restricted to authenticated administrators.
router.use(protect, admin);


router.get("/stats", getDashboardStats);

router.get("/orders", getAllOrders);

router.get("/users", getAllUsers);

router.put("/orders/:id/status", updateOrderStatus);

router.get("/orders/:id", getOrderById);

router.route("/blogs").get(getAdminBlogs).post(createBlog);
router.route("/blogs/:id").put(updateBlog).delete(deleteBlog);
router.route("/advertisements").get(getAdminAdvertisements).post(createAdvertisement);
router.route("/advertisements/:id").put(updateAdvertisement).delete(deleteAdvertisement);





export default router;
