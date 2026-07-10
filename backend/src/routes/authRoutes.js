import express from "express";
import { getMe, loginUser, registerUser, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

// Auth routes handle account creation, login, and profile details.
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;
