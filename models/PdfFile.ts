import mongoose from 'mongoose';

export interface IPdfFile extends mongoose.Document {
  filename: string;
  path: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadDate: Date;
  fileSize: number;
}

const pdfFileSchema = new mongoose.Schema<IPdfFile>({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadDate: { type: Date, default: Date.now },
  fileSize: { type: Number, required: true }
});

export default mongoose.models.PdfFile || mongoose.model<IPdfFile>('PdfFile', pdfFileSchema);
