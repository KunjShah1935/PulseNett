import mongoose from "mongoose";

const patientDetailSchema = new mongoose.Schema({
  patientName: String,
  patientId:   String,
  HR:    Number,
  BP:    String,
  Temp:  Number,
  SpO2:  Number,
  time:  String,
  date:  String,
  risk:   Number,
  status: String,
  recordedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Patient_detail", patientDetailSchema, "Patient_detail");
