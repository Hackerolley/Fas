import express from "express";
import { getActiveAdvertisements } from "../controllers/advertisementController.js";

const router = express.Router();
router.get("/", getActiveAdvertisements);
export default router;
