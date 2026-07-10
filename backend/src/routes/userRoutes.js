import express from "express";
import { deleteUser, getUserById, getUsers, updateUser } from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

// User routes are admin-only because customers use auth/profile routes.
const router = express.Router();

router.route("/").get(protect, admin, getUsers);
router.route("/:id").get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

export default router;
