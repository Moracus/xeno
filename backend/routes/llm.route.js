import express from "express";
import { queryCustomers } from "../controllers/llmController.js";

const router = express.Router();

router.post("/search-customers", queryCustomers);

export default router;
