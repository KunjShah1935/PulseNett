import express from "express";
import axios from "axios";
import twilio from "twilio";
import PatientDetail from "../models/PatientDetail.js";

const router = express.Router();
const historyMap = {}; // in-memory cache for patient vitals history sequence

// Twilio SMS Helper
async function sendSMSAlert(patientName, risk, status, criticalParams) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE;
    const toPhone = process.env.ALERT_PHONE;

    if (!accountSid || !authToken || !fromPhone || !toPhone || accountSid.startsWith("ACXXXX")) {
      console.log(`[Twilio Bypass] SMS alert not sent because Twilio credentials are not configured.`);
      console.log(`SMS Alert Details: Patient: ${patientName}, Risk: ${risk}%, Status: ${status}, Params: ${criticalParams.join(', ')}`);
      return;
    }

    const client = twilio(accountSid, authToken);
    const paramText = criticalParams.length > 0
      ? ` Params:${criticalParams.join(',')}`
      : '';

    await client.messages.create({
      body: `PULSENET ALERT\nPatient:${patientName}\nRisk:${risk}%\nStatus:${status}${paramText}`,
      from: fromPhone,
      to: toPhone.startsWith("+") ? toPhone : `+91${toPhone}`,
    });
    console.log(`SMS alert sent successfully for ${patientName} - Risk: ${risk}%`);
  } catch (err) {
    console.error("SMS sending failed:", err.message);
  }
}

// POST /api/ai/predict - Save vitals & run sepsis prediction
router.post("/predict", async (req, res) => {
  try {
    const { HR, BP, Temp, SpO2, patientName, patientId, time, date } = req.body;

    const systolic = parseFloat(BP.toString().split('/')[0]);
    const isCritical = SpO2 < 90 || HR > 120 || HR < 40 || Temp > 103 || systolic > 180 || systolic < 70;

    // Load history from MongoDB if not cached in memory
    if (!historyMap[patientId]) {
      const recent = await PatientDetail.find({ patientId })
        .sort({ recordedAt: -1 })
        .limit(5)
        .lean();
      historyMap[patientId] = recent.reverse().map(r => {
        const sys = parseFloat(r.BP.toString().split('/')[0]);
        return [r.HR, sys, r.Temp, r.SpO2];
      });
    }
    const history = historyMap[patientId];

    // Add current reading to history
    history.push([HR, systolic, Temp, SpO2]);
    if (history.length > 5) history.shift();

    // If not critical and we don't have 5 historical readings, we wait for more entries
    if (!isCritical && history.length < 5) {
      await PatientDetail.create({ patientName, patientId, HR, BP, Temp, SpO2, time, date });
      return res.json({
        message: `Need ${5 - history.length} more readings`,
        history
      });
    }

    // If critical but history is short, pad it to 5 with the current reading to run model immediately
    let sequence = history;
    if (isCritical && history.length < 5) {
      const current = [HR, systolic, Temp, SpO2];
      sequence = Array(5).fill(current);
    }

    // Post to Flask ML microservice
    const flaskUrl = process.env.FLASK_URL || "http://localhost:5001";
    let risk = 0;
    let status = "Normal";

    try {
      const response = await axios.post(`${flaskUrl}/predict`, { sequence });
      risk = response.data.risk;
      status = response.data.status;
    } catch (flaskErr) {
      console.error("Failed to connect to Flask server:", flaskErr.message);
      // Fail-safe logic if ML server is down: run rules-based prediction
      risk = isCritical ? 75.0 : 20.0;
      status = risk >= 50.0 ? "High Risk" : "Normal";
    }

    // Trigger SMS alerts if risk is 80% or greater
    if (risk >= 80) {
      const criticalParams = [];
      if (SpO2 < 95)             criticalParams.push(`SpO2:${SpO2}%(low)`);
      if (HR > 100 || HR < 60)   criticalParams.push(`HR:${HR}bpm(abnormal)`);
      if (Temp > 99.5)           criticalParams.push(`Temp:${Temp}F(fever)`);
      if (systolic < 90 || systolic > 140) criticalParams.push(`BP:${systolic}mmHg(abnormal)`);
      
      await sendSMSAlert(patientName, risk, status, criticalParams);
    }

    // Save vitals and calculated risk log
    const newRecord = await PatientDetail.create({
      patientName,
      patientId,
      HR,
      BP,
      Temp,
      SpO2,
      time,
      date,
      risk,
      status
    });

    res.json({ sequence: history, result: { risk, status }, data: newRecord });

  } catch (error) {
    console.error("Vitals prediction endpoint error:", error.message);
    res.status(500).json({ error: "ML API error" });
  }
});

// GET /api/ai/records - Retrieve global logs list
router.get("/records", async (req, res) => {
  try {
    const records = await PatientDetail.find().sort({ recordedAt: -1 }).limit(50);
    res.json(records);
  } catch (error) {
    console.error("Fetch records error:", error.message);
    res.status(500).json({ error: "Failed to fetch records" });
  }
});

// GET /api/ai/latest/:patientId - Retrieve single latest prediction for a patient
router.get("/latest/:patientId", async (req, res) => {
  try {
    const latest = await PatientDetail.findOne({ patientId: req.params.patientId }).sort({ recordedAt: -1 });
    if (!latest) {
      return res.status(404).json({ error: "No records found for this patient" });
    }
    res.json(latest);
  } catch (error) {
    console.error("Fetch latest record error:", error.message);
    res.status(500).json({ error: "Failed to fetch patient record" });
  }
});

export default router;
