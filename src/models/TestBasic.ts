import mongoose, { Schema, Document } from "mongoose";

export interface ITestBasic extends Document {
  testName: string;
  abbreviation: string;
  unit?: string;
  rangeLow?: string;
  rangeHigh?: string;
}

const TestBasicSchema = new Schema<ITestBasic>(
  {
    testName: { type: String, required: true },
    abbreviation: { type: String, required: true, unique: true },
    unit: { type: String },
    rangeLow: { type: String },
    rangeHigh: { type: String },
  },
  { timestamps: true }
);

export const TestBasic =
  mongoose.models.TestBasic || mongoose.model<ITestBasic>("TestBasic", TestBasicSchema);
