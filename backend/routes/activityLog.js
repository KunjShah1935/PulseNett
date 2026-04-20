import express from "express";
import ActivityLog from "../models/ActivityLog.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const log = new ActivityLog(req.body);
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
