import express from "express";
import Inventory from "../models/Inventory.js";
import ActivityLog from "../models/ActivityLog.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await Inventory.find().sort({ name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    await ActivityLog.create({ action: "Medicine added to inventory", user: "Pharmacy", detail: `${req.body.name} · Stock: ${req.body.stock}` });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
