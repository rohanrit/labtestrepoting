import mongoose from "mongoose";

const HorseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: String,
  age: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Horse || mongoose.model("Horse", HorseSchema);
