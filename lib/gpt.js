import axios from 'axios';

export async function processTextWithGpt(text, apiKey) {
  const prompt = `
Extract all horse hematology lab test results from the following report and output them as a JSON array. Each element should include:
- "testName"
- "result"
- "units"
Here is the report:
"""${text}"""
`;

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
      temperature: 0,
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
    }
  );
  return response.data.choices[0].message.content;
}
