// File: src/app/api/extract/route.ts
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Patient from "@/models/Patient";
import LabResult from "@/models/LabResult";
import { processTextWithGpt } from "@/lib/gpt";

export const runtime = "nodejs"; // ✅ ensure Node.js runtime

export async function POST(request: Request) {
  try {
    const buffer = Buffer.from(await request.arrayBuffer());

    await connectMongo();

    const pdfParse = (await import("pdf-parse")).default;
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    const gptRawOutput = await processTextWithGpt(
      text,
      process.env.OPENAI_API_KEY ?? ""
    );

    let parsedData;
    try {
      parsedData = JSON.parse(gptRawOutput);
    } catch {
      return NextResponse.json({ error: "Invalid GPT output JSON", gptRawOutput }, { status: 502 });
    }

    const patientDoc = await Patient.create(parsedData.patient);

    for (const lab of parsedData.labResults) {
      await LabResult.create({ ...lab, patient: patientDoc._id });
    }

    // Return the extracted data so the client can use it directly
    return NextResponse.json({ data: parsedData.labResults, patient: parsedData.patient });
  } catch (err: unknown) {
    console.error("/api/extract error:", err);
    let message = String(err);
    if (err && typeof err === "object" && "message" in err) {
      const e = err as { message?: unknown };
      if (typeof e.message === "string") message = e.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
