// File: src/app/api/extract/route.ts
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import Patient from "@/models/Patient";
import LabResult from "@/models/LabResult";
import { processTextWithGptJson, LabResult as LabResultType } from "@/lib/gpt";

export const runtime = "nodejs"; // ✅ ensure Node.js runtime

export async function POST(request: Request) {
  try {
    const buffer = Buffer.from(await request.arrayBuffer());

    await connectMongo();

    const pdfParse = (await import("pdf-parse")).default;
    let pdfData: any;

    // Quick heuristic: if the bytes decode to a path-like string, read that file instead
    const possiblePath = buffer.toString("utf8").trim();
    const looksLikePath = Boolean(
      possiblePath && (possiblePath.startsWith("/") || /^[A-Za-z]:\\/.test(possiblePath) || possiblePath.startsWith(".."))
    );

    if (looksLikePath) {
      try {
        const fs = await import("fs/promises");
        const fileBuf = await fs.readFile(possiblePath);
        pdfData = await pdfParse(fileBuf);
      } catch (fsErr: any) {
        console.error("Failed to read/parse file at path provided in request body:", fsErr);
        return NextResponse.json({ error: "File path provided in request body could not be read or parsed" }, { status: 400 });
      }
    } else {
      try {
        pdfData = await pdfParse(buffer);
      } catch (parseErr: any) {
        console.error("pdf-parse failed:", parseErr);
        return NextResponse.json({ error: "Failed to parse PDF content" }, { status: 400 });
      }
    }
    const text = pdfData?.text ?? "";

    const parsedData = await processTextWithGptJson(text, process.env.OPENAI_API_KEY ?? "");
    // Basic validation
    if (!parsedData || !Array.isArray(parsedData.labResults)) {
      return NextResponse.json({ error: "Invalid GPT structure" }, { status: 502 });
    }

    const patientDoc = await Patient.create(parsedData.patient ?? {});

    const savedResults: LabResultType[] = [];
    for (const lab of parsedData.labResults) {
      // basic validation of each lab item
      if (lab && typeof lab.testName === "string" && typeof lab.result === "string") {
        const created = await LabResult.create({ ...lab, patient: patientDoc._id });
        savedResults.push(created as unknown as LabResultType);
      }
    }

    // Return the extracted data so the client can use it directly
    return NextResponse.json({ data: savedResults, patient: parsedData.patient });
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
