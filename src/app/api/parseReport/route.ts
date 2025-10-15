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

    // ✅ Securely read the API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
    }

    // Define structure for medical data
    const reportSchema = z.object({
      mode: z.string().optional(),
      phone: z.string().optional(),
      caseId: z.string().optional(),
      masterName:  z.string().optional(),
      sex:  z.string().optional(),
      age:  z.string().optional(),
      animalType: z.string().optional(),
      horseId: z.string().optional(),
      animalName: z.string().optional(),
      testDate: z.string().optional(),
      results: z.array(
        z.object({
          test: z.string(),
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
      apiKey, // ✅ Pass the key explicitly
    });

    const prompt = `
You are a medical data extraction assistant. 
Extract structured report data for a horse from the following text. 
Include test name, result value, unit, and normal range if available.
If animal name, ID, or date appear, include them too.

Return data in JSON strictly following this format:
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
