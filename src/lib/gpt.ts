import axios from "axios";

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
