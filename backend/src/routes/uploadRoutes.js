import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { admin, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

// Upload route is admin-only and expects a multipart field named image.
const router = express.Router();

router.post("/image", protect, admin, upload.single("image"), uploadImage);

export default router;
