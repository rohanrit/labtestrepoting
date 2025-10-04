import mongoose from 'mongoose';

export interface ITestReport extends mongoose.Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  testType: string;
  results: Record<string, any>;
  status: 'pending' | 'completed' | 'verified';
  reportDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const testReportSchema = new mongoose.Schema<ITestReport>(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testType: { type: String, required: true },
    results: { type: Map, of: mongoose.Schema.Types.Mixed },
    status: {
      type: String,
      enum: ['pending', 'completed', 'verified'],
      default: 'pending'
    },
    reportDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.TestReport || mongoose.model<ITestReport>('TestReport', testReportSchema);
