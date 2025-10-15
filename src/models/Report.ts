import mongoose from 'mongoose';

const TestResultSchema = new mongoose.Schema({
  item: String,
  value: String,
  unit: String,
  range: String,
});

const ReportSchema = new mongoose.Schema({
    mode:String,
    phone: Number, 
    caseId:String,
    masterName:String,
    sex: String,
    age: Number,
    animalType: String,
    horseId: String,
    animalName: String,
    testDate: Date,
    results: [TestResultSchema],
});

export const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);
