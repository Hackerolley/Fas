import express from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getAdminProducts,
  getProductByIdOrSlug,
  getProducts,
  updateProduct
} from "../controllers/productController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

// Product routes serve the public catalog and protected admin mutations.
const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/admin/all", protect, admin, getAdminProducts);
router.route("/:idOrSlug").get(getProductByIdOrSlug);
router.route("/:id").put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.route("/:id/reviews").post(protect, createProductReview);

export default router;
