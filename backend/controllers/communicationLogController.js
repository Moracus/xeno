import CommunicationLog from "../models/CommunicationLog.js";

export const addLog = async (req, res) => {
  try {
    const log = new CommunicationLog(req.body);
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getLogsByCampaignId = async (req, res) => {
  try {
    const logs = await CommunicationLog.find({
      campaignId: req.params.campaignId,
    }).populate("customerId");
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLogStatus = async (req, res) => {
  try {
    const updatedLog = await CommunicationLog.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!updatedLog) {
      return res.status(404).json({ message: "Log entry not found" });
    }
    res.status(200).json(updatedLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
