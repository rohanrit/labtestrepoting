import mongoose from "mongoose";

const TestResultSchema = new mongoose.Schema({
  item: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String},
  range: { type: String},
});

const ReportSchema = new mongoose.Schema({
  mode: { type: String, required: true },
  horseName: { type: String, required: true },
  testDate: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  results: [TestResultSchema],
});

export const Report =
  mongoose.models.Report || mongoose.model("Report", ReportSchema);
