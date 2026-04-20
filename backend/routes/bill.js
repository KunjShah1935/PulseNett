import express from "express";
import Bill from "../models/Bill.js";
import Admission from "../models/Admission.js";
import Medication from "../models/Medication.js";
import Charge from "../models/Charge.js";
import ActivityLog from "../models/ActivityLog.js";

const router = express.Router();

// GET ALL BILLS
router.get("/", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// AUTO SUMMARY — room + consultation + pharmacy charges
router.get("/summary/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const admission = await Admission.findOne({ patientId });
    if (!admission) return res.status(404).json({ message: "No admission found" });

    const days = Math.max(1, Math.ceil((new Date() - new Date(admission.admissionDate)) / (1000 * 60 * 60 * 24)));

    // fetch charge rates
    const roomCharge = await Charge.findOne({ type: "Room" });
    const consultCharge = await Charge.findOne({ type: "Consultation" });

    const items = [];

    if (roomCharge) {
      items.push({ description: `Room Charge (${admission.roomNumber}) × ${days} day(s)`, amount: roomCharge.amount * days, category: "Room" });
    }

    if (consultCharge) {
      items.push({ description: `Doctor Consultation (${admission.doctorId}) × ${days} day(s)`, amount: consultCharge.amount * days, category: "Consultation" });
    }

    // pharmacy medications — only dispensed ones with actual price
    const meds = await Medication.find({ patientId });
    meds.forEach(m => {
      items.push({
        description: `Medicine: ${m.medicineName} (${m.dosage})`,
        amount: m.dispensed ? (m.price || 0) : 0,
        category: "Pharmacy",
        note: m.dispensed ? null : "Pending dispense"
      });
    });

    // manual bills
    const manualBills = await Bill.find({ patientId }).sort({ createdAt: -1 });
    manualBills.forEach(b => {
      b.items?.forEach(item => {
        items.push({ description: item.description, amount: item.amount, category: "Manual" });
      });
    });

    const totalAmount = items.reduce((sum, i) => sum + (i.amount || 0), 0);
    const status = manualBills.length > 0 ? manualBills[0].status : "unpaid";

    res.json({ patientId, patientName: manualBills[0]?.patientName || "", admissionDate: admission.admissionDate, days, items, totalAmount, status });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET BY PATIENT
router.get("/:patientId", async (req, res) => {
  try {
    const data = await Bill.find({ patientId: req.params.patientId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD BILL
router.post("/add", async (req, res) => {
  try {
    const data = new Bill(req.body);
    await data.save();

    await ActivityLog.create({
      action: "Bill generated",
      user: "Admin",
      detail: `₹${req.body.totalAmount} → Patient ${req.body.patientId}`
    });

    res.json({ message: "Bill added", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MARK AS PAID
router.put("/pay/:id", async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, { status: "paid" }, { returnDocument: 'after' });

    await ActivityLog.create({
      action: "Bill paid",
      user: "Admin",
      detail: `₹${bill.totalAmount} paid by Patient ${bill.patientId}`
    });

    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE BILL
router.delete("/:id", async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
