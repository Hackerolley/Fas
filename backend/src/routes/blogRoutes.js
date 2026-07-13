import express from "express";
import { addComment, getBlogBySlug, getPublishedBlogs } from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getPublishedBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/:slug/comments", protect, addComment);
export default router;
