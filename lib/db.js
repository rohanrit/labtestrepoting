import path from 'path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbFile = path.join(process.cwd(), 'database', 'labdata.sqlite');

export async function openDb() {
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      testName TEXT,
      result TEXT,
      units TEXT,
      ranges TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
}
