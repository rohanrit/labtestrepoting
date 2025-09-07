import { openDb } from '../../lib/db.js';

export default async function handler(req, res) {
  const db = await openDb();
  const records = await db.all('SELECT * FROM records ORDER BY createdAt DESC');

  const header = 'Test Name,Result,Units,Ranges,Created At\n';
  const rows = records
    .map(row => `"${row.testName}","${row.result}","${row.units}","${row.ranges}","${row.createdAt}"`)
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="lab_data.csv"');
  res.status(200).send(header + rows);
}
