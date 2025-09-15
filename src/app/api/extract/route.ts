// File: src/app/api/extract/route.ts

import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Patient from "@/models/Patient";
import LabResult from "@/models/LabResult";
import { processTextWithGpt } from "@/lib/gpt";

export async function POST(request: Request) {
  // Read raw PDF data from request
  const buffer = Buffer.from(await request.arrayBuffer());

  // Connect to MongoDB
  await connectMongo();

  // Dynamically import pdf-parse (fixes import error in ES module context)
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = pdfParseModule.default;

  // Extract text from PDF buffer
  const pdfData = await pdfParse(buffer);
  const text = pdfData.text;

  // Send extracted text to GPT for structured JSON extraction
  const gptRawOutput = await processTextWithGpt(text, process.env.OPENAI_API_KEY ?? "");

  let parsedData;
  try {
    // Parse GPT JSON output
    parsedData = JSON.parse(gptRawOutput);
  } catch (error) {
    // Return error with raw GPT output for debugging
    return NextResponse.json({ error: "Invalid GPT output JSON", gptRawOutput });
  }

  // Save patient info to MongoDB
  const patientDoc = await Patient.create(parsedData.patient);

  // Save each lab result linked to the patient
  for (const lab of parsedData.labResults) {
    await LabResult.create({ ...lab, patient: patientDoc._id });
  }

  return NextResponse.json({ success: true });
}
