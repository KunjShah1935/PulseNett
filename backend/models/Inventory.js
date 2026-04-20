import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  stock: { type: Number, default: 0 },
  unit: { type: String, default: "Tablets" },
  reorder: { type: Number, default: 100 },
  expiry: String,
}, { timestamps: true });

export default mongoose.model("Inventory", inventorySchema);
