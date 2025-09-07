import pdfParse from 'pdf-parse';
import { processTextWithGpt } from '../../lib/gpt';

export const config = {
  api: {
    bodyParser: false, // handle multipart manually
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  // Extract raw PDF text
  const data = await pdfParse(buffer);
  const text = data.text;

  // Process with GPT to extract structured lab data
  const gptOutput = await processTextWithGpt(text, process.env.OPENAI_API_KEY);

  try {
    const json = JSON.parse(gptOutput);
    return res.status(200).json({ json });
  } catch {
    return res.status(200).json({ json: gptOutput });
  }
}
