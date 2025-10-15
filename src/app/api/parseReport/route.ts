import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
    }

    // ✅ Updated schema with separate value and unit
    const reportSchema = z.object({
      mode: z.string().optional(),
      phone: z.number().nullable(),
      caseId: z.string().nullable(),
      masterName: z.string().nullable(),
      sex: z.string().nullable(),
      age: z.number().nullable(),
      animalType: z.string().optional(),
      horseId: z.string().optional(),
      animalName: z.string().optional(),
      testDate: z.string().optional(),
      results: z.array(
        z.object({
          item: z.string(),
          value: z.string(),
          unit: z.string().optional(),
          range: z.string().optional(),
        })
      ),
    });

    const parser = StructuredOutputParser.fromZodSchema(reportSchema as z.ZodType<any, any, any>);

    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0,
      apiKey,
    });

    const prompt = `
You are a medical data extraction assistant.
Extract structured report data for a horse from the following text.

Return only raw JSON — do not include markdown, code blocks, or explanations.

Format:
${parser.getFormatInstructions()}

You are a medical data extraction assistant. 
Extract structured report data for a horse from the following text.

For each test result:
- Separate the numeric value and the unit.
- Include test name, value, and unit.
- If animal ID or test date appear, include them too.

Return only raw JSON — do not include markdown, code blocks, or explanations strictly following this format:
${parser.getFormatInstructions()}

Text:
${text}
`;

    const response = await model.invoke(prompt);
    const parsed = await parser.parse(response.content as string);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}
