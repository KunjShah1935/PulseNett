import express from "express";
import Charge from "../models/Charge.js";

const router = express.Router();

// GET all charges
router.get("/", async (req, res) => {
  try {
    const charges = await Charge.find();
    res.json(charges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD charge
router.post("/add", async (req, res) => {
  try {
    const charge = new Charge(req.body);
    await charge.save();
    res.json(charge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE charge
router.put("/:id", async (req, res) => {
  try {
    const updated = await Charge.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE charge
router.delete("/:id", async (req, res) => {
  try {
    await Charge.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
