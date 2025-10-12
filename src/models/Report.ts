import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  type: string;
  fileUrl: string;
  description?: string;
  horseId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>({
  type: { type: String, required: true },
  fileUrl: { type: String, required: true },
  description: String,
  horseId: { type: Schema.Types.ObjectId, ref: "Horse", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Report || mongoose.model<IReport>("Report", ReportSchema);
