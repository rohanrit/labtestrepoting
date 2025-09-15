import { NextApiRequest, NextApiResponse } from 'next';
import pdfParse from 'pdf-parse';
import { openDb } from '../../lib/db.js';
import { processTextWithGpt } from '../../lib/gpt.js';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);

  try {
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    const gptOutput = await processTextWithGpt(text, process.env.OPENAI_API_KEY || '');

    let entries: any;
    try {
      entries = JSON.parse(gptOutput);
      if (typeof entries === 'string') {
        entries = JSON.parse(entries);
      }
    } catch (err) {
      console.error('JSON parse error:', err);
      return res.status(400).json({ error: 'Invalid GPT output JSON', gptOutput });
    }

    const db = await openDb();

    for (const entry of entries) {
      await db.run(
        'INSERT INTO records (testName, result, units, ranges) VALUES (?, ?, ?, ?)',
        entry.testName,
        entry.result,
        entry.units,
        entry.ranges
      );
    }

    res.status(200).json({ data: entries });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
