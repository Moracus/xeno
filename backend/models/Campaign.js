import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    segmentRules: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    audienceSize: { type: Number },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
