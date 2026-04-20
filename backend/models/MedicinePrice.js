import mongoose from "mongoose";

const medicinePriceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, default: "" },
  price: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("MedicinePrice", medicinePriceSchema);
