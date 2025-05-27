import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByCustomerId,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/customer/:customerId", getOrdersByCustomerId);
router.delete("/:id", deleteOrder);

export default router;
