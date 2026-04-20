import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  patientName: String,
  items: [
    {
      description: String,
      amount: Number
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  }
}, { timestamps: true });

export default mongoose.model("Bill", billSchema);
