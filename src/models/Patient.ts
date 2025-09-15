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
  species: String,
  patientName: { type: String, required: true },
  owner: String,
  gender: String,
  age: String,
  patientId: String,
  diagnosis: String,
  years: String,
  sampleType: String,
  lot: String,
  createdAt: { type: Date, default: Date.now },
});

const Patient: Model<IPatient> =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

export default Patient;
