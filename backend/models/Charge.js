  import mongoose from "mongoose";

const chargeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Room", "Test", "Consultation"], required: true },
  amount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Charge", chargeSchema);
