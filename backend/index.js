import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import customerRoutes from "./routes/customer.route.js";
import orderRoutes from "./routes/order.route.js";
import campaignRoutes from "./routes/campaign.route.js";
import communicationLogRoutes from "./routes/communication.route.js";
import authRoutes from "./routes/auth.routes.js";
import llmRoutes from "./routes/llm.route.js";
import { googleLogin } from "./controllers/authController.js";

dotenv.config();
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/llm", llmRoutes);
app.use("/api/auth", googleLogin);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/logs", communicationLogRoutes);

//error handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "something went wrong!!";
  return res.status(200).json({
    success: false,
    status,
    message,
  });
});
// default get
app.get("/", async (req, res) => {
  res.status(200).json({
    message: "hello world",
  });
});

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGO_URL, { dbName: "xeno" })
    .then(() => console.log("Monodb connected"))
    .catch((err) => {
      console.error("faled to connect");
      console.error(err);
    });
};

const starServer = () => {
  try {
    connectDB();
    app.listen(5000, () => console.log("server has been started"));
  } catch (error) {
    console.log(error);
  }
};
starServer();
