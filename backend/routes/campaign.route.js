import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  deleteCampaign,
} from "../controllers/campaignController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createCampaign);
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);
router.delete("/:id", deleteCampaign);

export default router;
