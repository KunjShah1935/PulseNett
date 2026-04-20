import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: String, required: true },
  detail: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("ActivityLog", activityLogSchema);
