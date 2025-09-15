import type { NextApiRequest, NextApiResponse } from 'next';
import { openDb } from '../../lib/db.js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = await openDb();

  if (req.method === 'GET') {
    const records = await db.all('SELECT * FROM records ORDER BY createdAt DESC');
    res.status(200).json({ data: records });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
