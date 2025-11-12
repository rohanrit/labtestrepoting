import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { TestBasic } from "../src/models/TestBasic";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env file");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Connected to MongoDB");

    const testData = [
          { testName: "Haemoglobin", abbreviation: "HGB", unit: "g/L", rangeLow: "95", rangeHigh: "165" },
    { testName: "Red Blood Cells", abbreviation: "RBC", unit: "10^12/L", rangeLow: "4.8", rangeHigh: "13.0" },
    { testName: "Hematocrit", abbreviation: "HCT", unit: "%", rangeLow: "28.0", rangeHigh: "47.0" },
    { testName: "Mean Cell Volume", abbreviation: "MCV", unit: "fL", rangeLow: "36.0", rangeHigh: "55.0" },
    { testName: "Mean Cell Haem", abbreviation: "MCH", unit: "pg", rangeLow: "13.5", rangeHigh: "19.5" },
    { testName: "MCHC", abbreviation: "MCHC", unit: "g/L", rangeLow: "320", rangeHigh: "390" },
    { testName: "PLT", abbreviation: "PLT", unit: "10^9/L", rangeLow: "90", rangeHigh: "280" },
    { testName: "White Blood Cells", abbreviation: "WBC", unit: "10^9/L", rangeLow: "4.9", rangeHigh: "11.1" },
    { testName: "Neutrophils", abbreviation: "NEU%", unit: "%", rangeLow: "38.0", rangeHigh: "70.0" },
    { testName: "Lymphocytes", abbreviation: "LYM%", unit: "%", rangeLow: "25.0", rangeHigh: "62.0" },
    { testName: "Monocytes", abbreviation: "MON%", unit: "%", rangeLow: "1.0", rangeHigh: "8.0" },
    { testName: "Eosinophils", abbreviation: "EOS%", unit: "%", rangeLow: "0.10", rangeHigh: "9.50" },
    { testName: "Basophils", abbreviation: "BASO%", unit: "%", rangeLow: "0.00", rangeHigh: "1.20" },
    { testName: "Neutrophils", abbreviation: "NEU#", unit: "10^9/L", rangeLow: "2.18", rangeHigh: "6.36" },
    { testName: "Lymphocytes", abbreviation: "LYM#", unit: "10^9/L", rangeLow: "1.32", rangeHigh: "5.86" },
    { testName: "Monocytes", abbreviation: "MON#", unit: "10^9/L", rangeLow: "0.05", rangeHigh: "0.82" },
    { testName: "Eosinophils", abbreviation: "EOS#", unit: "10^9/L", rangeLow: "0.01", rangeHigh: "1.00" },
    { testName: "Basophils", abbreviation: "BASO#", unit: "10^9/L", rangeLow: "0.00", rangeHigh: "0.12" },
    { testName: "Sodium", abbreviation: "Na", unit: "mmol/L", rangeLow: "126", rangeHigh: "146" },
    { testName: "Potassium", abbreviation: "K", unit: "mmol/L", rangeLow: "2.5", rangeHigh: "5.2" },
    { testName: "Chloride", abbreviation: "Cl", unit: "mmol/L", rangeLow: "92", rangeHigh: "104" },
    { testName: "Urea", abbreviation: "BUN", unit: "mmol/L", rangeLow: "2.5", rangeHigh: "8.9" },
    { testName: "Creatinine", abbreviation: "CRE", unit: "µmol/L", rangeLow: "73", rangeHigh: "194" },
    { testName: "CPK", abbreviation: "CK", unit: "U/L", rangeLow: "120", rangeHigh: "470" },
    { testName: "AST", abbreviation: "AST", unit: "U/L", rangeLow: "175", rangeHigh: "450" },
    { testName: "ALT", abbreviation: "ALT", unit: "U/L", rangeLow: "5", rangeHigh: "20" },
    { testName: "Total Protein", abbreviation: "TP", unit: "g/L", rangeLow: "50", rangeHigh: "81" },
    { testName: "Albumin", abbreviation: "ALB", unit: "g/L", rangeLow: "22", rangeHigh: "37" },
    { testName: "Globulin", abbreviation: "GLO", unit: "g/L", rangeLow: "20", rangeHigh: "58" },
    { testName: "Bilirubin", abbreviation: "TBIL", unit: "µmol/L", rangeLow: "9", rangeHigh: "50" },
    { testName: "GGT", abbreviation: "GGT", unit: "U/L", rangeLow: "10", rangeHigh: "50" },
    { testName: "Alk Phos", abbreviation: "ALP", unit: "U/L", rangeLow: "75", rangeHigh: "254" },
    { testName: "TBA", abbreviation: "TBA", unit: "µmol/L", rangeLow: "0", rangeHigh: "15" },
    { testName: "TG", abbreviation: "TG", unit: "mmol/L", rangeLow: "0", rangeHigh: "0.76" },
    { testName: "CHOL", abbreviation: "CHOL", unit: "mmol/L", rangeLow: "1.8", rangeHigh: "3.9" },
    { testName: "GLU", abbreviation: "GLU", unit: "mmol/L", rangeLow: "3.6", rangeHigh: "6.1" },
    { testName: "Calcium", abbreviation: "Ca", unit: "mmol/L", rangeLow: "2.9", rangeHigh: "3.6" },
    { testName: "Phosphorus", abbreviation: "P", unit: "mmol/L", rangeLow: "0.61", rangeHigh: "1.42" },
    { testName: "Magnesium", abbreviation: "Mg", unit: "mmol/L", rangeLow: "0.6", rangeHigh: "1.2" },
    ];

    await TestBasic.deleteMany({});
    await TestBasic.insertMany(testData);

    console.log(`✅ Seeded ${testData.length} test entries`);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

seed();
