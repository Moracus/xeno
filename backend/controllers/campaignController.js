import Campaign from "../models/Campaign.js";
import CommunicationLog from "../models/CommunicationLog.js";

export const createCampaign = async (req, res) => {
  try {
    const { name, audienceSize, customers, message } = req.body;
    const campaign = new Campaign({
      name,
      audienceSize,
    });
    const savedCampaign = await campaign.save();
    const customerDetails = JSON.parse(customers);
    // Shuffle customers for random SENT/FAILED assignment
    const shuffledCustomers = [...customerDetails].sort(
      () => Math.random() - 0.5
    );

    // Calculate the SENT and FAILED counts
    const sentCount = Math.floor(shuffledCustomers.length * 0.9);
    const failedCount = shuffledCustomers.length - sentCount;

    // Assign statuses
    const logs = shuffledCustomers.map((customer, index) => ({
      campaignId: savedCampaign?._id, // Ensure campaignId is included in the request
      customerId: customer._id,
      status: index < sentCount ? "SENT" : "FAILED",
      message: message.replace("{name}", customer.name),
    }));

    // Insert logs into the CommunicationLog collection
    await CommunicationLog.insertMany(logs);

    res.status(201).json({
      message: "Communication logs created successfully.",
      total: logs.length,
      sent: sentCount,
      failed: failedCount,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!deletedCampaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
