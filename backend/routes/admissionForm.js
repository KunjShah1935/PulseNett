import express from "express";
import AdmissionForm from "../models/AdmissionForm.js";
import ActivityLog from "../models/ActivityLog.js";

const router = express.Router();

// ADD FORM
router.post("/add", async (req, res) => {
  try {
    const form = new AdmissionForm(req.body);
    await form.save();

    await ActivityLog.create({
      action: "Admission form submitted",
      user: req.body.fullname || "Patient",
      detail: `Patient ${req.body.patientId} submitted admission request`
    });

    res.json({ message: "Form saved ✅", data: form });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL FORMS
router.get("/", async (req, res) => {
  try {
    const forms = await AdmissionForm.find();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;