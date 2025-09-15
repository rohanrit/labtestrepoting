import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILabResult extends Document {
  patient: mongoose.Types.ObjectId;
  testName: string;
  result: string;
  units: string;
  ranges?: string;
  createdAt: Date;
}

const LabResultSchema: Schema<ILabResult> = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  testName: { type: String, required: true },
  result: { type: String, required: true },
  units: { type: String, required: true },
  ranges: String,
  createdAt: { type: Date, default: Date.now },
});
const LabResult: Model<ILabResult> =
  mongoose.models.LabResult || mongoose.model("LabResult", LabResultSchema);
export default LabResult;
