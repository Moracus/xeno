import express from "express";
import {
  addLog,
  getLogsByCampaignId,
  updateLogStatus,
} from "../controllers/communicationLogController.js";

const router = express.Router();

router.post("/", addLog);
router.get("/campaign/:campaignId", getLogsByCampaignId);
router.patch("/:id", updateLogStatus);

export default router;
