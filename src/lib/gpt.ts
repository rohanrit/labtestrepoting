import axios from "axios";

export interface LabResult {
  testName: string;
  result: string;
  units: string;
  ranges?: string;
}

export interface ParsedGptOutput {
  labResults: LabResult[];
  patient?: Record<string, unknown>;
}

export async function processTextWithGpt(
  text: string,
  apiKey: string
): Promise<string> {
  const prompt = `
Extract all horse hematology lab test results from the following report and output the JSON array directly, without string escaping and with keys: testName, result, units, ranges.
Report:
"""${text}"""
`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].message.content;
}

// Helper: call GPT and parse JSON into a structured object with validation
export async function processTextWithGptJson(
  text: string,
  apiKey: string
): Promise<ParsedGptOutput> {
  const raw = await processTextWithGpt(text, apiKey);
  const parsed = JSON.parse(raw);
  return parsed as ParsedGptOutput;
}
