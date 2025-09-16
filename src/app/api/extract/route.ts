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

    let dbConnected = false;
    try {
      await connectMongo();
      dbConnected = true;
    } catch (dbErr) {
      console.error("Warning: could not connect to MongoDB, continuing without persistence:", dbErr);
      dbConnected = false;
    }

  let pdfData: { text?: string } | undefined;

    // Quick heuristic: if the bytes decode to a path-like string, read that file instead
    const possiblePath = buffer.toString("utf8").trim();
    const looksLikePath = Boolean(
      possiblePath && (possiblePath.startsWith("/") || /^[A-Za-z]:\\/.test(possiblePath) || possiblePath.startsWith(".."))
    );

    if (looksLikePath) {
      try {
        const fs = await import("fs/promises");
        const fileBuf: Buffer = await fs.readFile(possiblePath);
  let pdfParse: unknown;
        try {
          pdfParse = (await import("pdf-parse")).default;
        } catch (impErr: unknown) {
          console.error("Failed to import pdf-parse:", impErr);
          return NextResponse.json({ error: "PDF parser unavailable" }, { status: 500 });
        }
        try {
          pdfData = await (pdfParse as unknown as (input: Buffer) => Promise<{ text?: string }>)(fileBuf);
        } catch (ppErr: unknown) {
          console.error("pdf-parse failed on file read from provided path:", ppErr);
          return NextResponse.json({ error: "Failed to parse PDF at provided file path" }, { status: 400 });
        }
      } catch (fsErr: unknown) {
        console.error("Failed to read file at path provided in request body:", fsErr);
        return NextResponse.json({ error: "File path provided in request body could not be read" }, { status: 400 });
      }
    } else {
  let pdfParse: unknown;
      try {
  pdfParse = (await import("pdf-parse")).default;
      } catch (impErr: unknown) {
        console.error("Failed to import pdf-parse:", impErr);
        return NextResponse.json({ error: "PDF parser unavailable" }, { status: 500 });
      }
      try {
        pdfData = await (pdfParse as unknown as (input: Buffer) => Promise<{ text?: string }>)(buffer);
      } catch (parseErr: unknown) {
        console.error("pdf-parse failed on buffer:", parseErr);
        return NextResponse.json({ error: "Failed to parse uploaded PDF content" }, { status: 400 });
      }
    }
    const text = pdfData?.text ?? "";

    const parsedData = await processTextWithGptJson(text, process.env.OPENAI_API_KEY ?? "");
    // Basic validation
    if (!parsedData || !Array.isArray(parsedData.labResults)) {
      return NextResponse.json({ error: "Invalid GPT structure" }, { status: 502 });
    }

  let savedResults: LabResultType[] = [];
  let patientDoc: unknown = null;
    if (dbConnected) {
      patientDoc = await Patient.create(parsedData.patient ?? {});
      for (const lab of parsedData.labResults) {
        // basic validation of each lab item
        if (lab && typeof lab.testName === "string" && typeof lab.result === "string") {
          // extract patient id if available
          const patientId = typeof patientDoc === "object" && patientDoc && "_id" in (patientDoc as { _id?: unknown }) ? (patientDoc as { _id?: unknown })._id : undefined;
          const created = await LabResult.create({ ...lab, patient: patientId });
          savedResults.push(created as unknown as LabResultType);
        }
      }
    } else {
      // If DB not available, write parsed result to disk so client can see it
      savedResults = parsedData.labResults as LabResultType[];
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const dataDir = path.join(process.cwd(), "data");
        try {
          await fs.mkdir(dataDir, { recursive: true });
        } catch {}
        const outPath = path.join(dataDir, "latest-extract.json");
        await fs.writeFile(outPath, JSON.stringify({ patient: parsedData.patient, data: savedResults }, null, 2), "utf8");
      } catch (fsErr) {
        console.error("Failed to write fallback data file:", fsErr);
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
