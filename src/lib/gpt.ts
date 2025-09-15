import axios from "axios";

export async function processTextWithGpt(
  text: string,
  apiKey: string
): Promise<string> {
  const prompt = `
Extract the horse hematology lab test results and patient metadata from the following lab report.

Return a JSON object with:
- "patient": { species, patientName, owner, gender, age, id, diagnosis, years, sampleType, lot }
- "labResults": an array of { testName, result, units, ranges }

Lab report:
"""${text}"""

Respond ONLY with valid JSON, without explanations.
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
