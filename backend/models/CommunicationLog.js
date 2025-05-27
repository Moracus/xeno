import mongoose from "mongoose";
const communicationLogSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    status: { type: String, enum: ["SENT", "FAILED"], required: true },
    message: { type: String },
  },
  { timestamps: true }
);

const CommunicationLog = mongoose.model(
  "CommunicationLog",
  communicationLogSchema
);
export default CommunicationLog;
