import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import { connectMongo } from "@/lib/mongoose";
import Patient from "@/models/Patient";
import LabResult from "@/models/LabResult";

export async function POST(request: Request) {
  const buffer = Buffer.from(await request.arrayBuffer());

  await connectMongo();

  const pdfData = await pdfParse(buffer);
  const text = pdfData.text;

  // Use GPT to parse `text` into structured data (your GPT function here)
  // For demo, use dummy parsedData:

  const parsedData = {
    patient: {
      species: "Horse",
      patientName: "Max",
      owner: "John",
      gender: "Male",
      age: "5",
      patientId: "A123",
      diagnosis: "Healthy",
      years: "2025",
      sampleType: "Blood",
      lot: "LOT001",
    },
    labResults: [
      { testName: "WBC", result: "8.08", units: "10^9/L", ranges: "6-12" },
      // more results...
    ],
  };

  const patientDoc = await Patient.create(parsedData.patient);
  for (const lab of parsedData.labResults) {
    await LabResult.create({
      ...lab,
      patient: patientDoc._id,
    });
  }

  return NextResponse.json({ success: true });
}
