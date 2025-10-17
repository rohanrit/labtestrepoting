import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Report } from '@/models/Report';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Fetch single report by ID
      const report = await Report.findById(id);
      if (!report) {
        return NextResponse.json({ error: 'Report not found' }, { status: 404 });
      }
      return NextResponse.json({ report });
    } else {
      // Fetch all reports
      const reports = await Report.find({});
      return NextResponse.json({ reports });
    }
  } catch (error) {
    console.error('Error fetching report(s):', error);
    return NextResponse.json({ error: 'Failed to fetch report(s)' }, { status: 500 });
  }
}
