// app/api/extract/route.ts
import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

export const runtime = "nodejs";

const reportSchema = z.object({
  horseName: z.string().nullable(),
  testDate: z.string().nullable(),
  results: z.array(
    z.object({
      item: z.string(),
      value: z.string(),
      unit: z.string().nullable(),
      range: z.string().nullable(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "No text provided" }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
      apiKey,
    });

    // Use Structured Outputs (OpenAI JSON schema mode) with required+nullable fields
    const structured = model.withStructuredOutput(reportSchema);

    // Keep your exact old prompt text
    const prompt = `
    The output must strictly follow the bound schema.

    You are a medical data extraction assistant. 
    Extract structured report data for a horse from the following text.

    For each test result:
    - Separate the numeric value and the unit.
    - Include test name, value, and unit.
    - If animal ID or test date appear, include them too.

    Return only raw JSON — do not include markdown, code blocks, or explanations strictly following this format:
    The output must strictly follow the bound schema.

    Text:
    ${text}
    `;

    const result = await structured.invoke(prompt);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}
