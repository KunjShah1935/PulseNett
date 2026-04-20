import express from "express";
import Medication from "../models/Medication.js";
import ActivityLog from "../models/ActivityLog.js";

const router = express.Router();

// GET ALL (pharmacy)
router.get("/all", async (req, res) => {
  try {
    const meds = await Medication.find().sort({ createdAt: -1 });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DISPENSE — mark as taken, save price
router.put("/dispense/:id", async (req, res) => {
  try {
    const { price } = req.body;
    const med = await Medication.findByIdAndUpdate(
      req.params.id,
      { status: "taken", dispensed: true, price: price || 0 },
      { returnDocument: 'after' }
    );

    await ActivityLog.create({
      action: "Medicine dispensed",
      user: "Pharmacy",
      detail: `${med.medicineName} ₹${price || 0} → Patient ${med.patientId}`
    });

    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 🔥 ADD (MongoDB)
router.post("/add", async (req, res) => {
  try {
    const data = new Medication(req.body);
    await data.save();

    await ActivityLog.create({
      action: "Medicine prescribed",
      user: req.body.doctorId || "Doctor",
      detail: `${req.body.medicineName || "Medicine"} → Patient ${req.body.patientId}`
    });

    res.json({ message: "Medication added", data });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 🔥 GET (MongoDB)
// 🔥 SPECIFIC FIRST
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const meds = await Medication.find({
      doctorId: req.params.doctorId
    });

    res.json(meds);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 GENERIC AFTER
router.get("/:patientId", async (req, res) => {
  try {
    const data = await Medication.find({
      patientId: req.params.patientId
    });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;