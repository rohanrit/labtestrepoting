// src/app/api/records/route.ts

import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import LabResult from "@/models/LabResult";

export async function GET() {
  try {
    // Connect to MongoDB
    await connectMongo();

    // Fetch all lab results, populate related patient data, sort by creation date desc
    const records = await LabResult.find()
      .populate("patient", "patientName species") // populate only needed patient fields
      .sort({ createdAt: -1 })
      .lean();

    // Return JSON response with all records
    return NextResponse.json({ data: records });
  } catch (error: unknown) {
    let message = "Failed to fetch records";
    if (error && typeof error === "object" && "message" in error) {
      message = (error as { message?: string }).message || message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
