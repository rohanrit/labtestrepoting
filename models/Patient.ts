import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPatient extends Document {
  species: string;
  patientName: string;
  owner: string;
  gender: string;
  age: string;
  patientId: string;
  diagnosis: string;
  years: string;
  sampleType: string;
  lot: string;
  createdAt: Date;
}

const PatientSchema: Schema<IPatient> = new Schema({
  species: { type: String, required: false },
  patientName: { type: String, required: true },
  owner: { type: String },
  gender: { type: String },
  age: { type: String },
  patientId: { type: String },
  diagnosis: { type: String },
  years: { type: String },
  sampleType: { type: String },
  lot: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Patient: Model<IPatient> = mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

export default Patient;
