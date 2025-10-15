import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Report } from '@/models/Report';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    // ✅ Convert testDate string to Date object
    if (body.testDate && typeof body.testDate === 'string') {
      const [day, month, year] = body.testDate.split('-');
      if (
        day?.length === 2 &&
        month?.length === 2 &&
        year?.length === 4 &&
        !isNaN(Number(day)) &&
        !isNaN(Number(month)) &&
        !isNaN(Number(year))
      ) {
        body.testDate = new Date(`${year}-${month}-${day}`);
      } else {
        console.error(`Invalid testDate format received: "${body.testDate}". Using current date instead.`);
        body.testDate = new Date(); // fallback to current date
      }
    }

    const saved = await Report.create(body);
    return NextResponse.json({ success: true, report: saved });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}
