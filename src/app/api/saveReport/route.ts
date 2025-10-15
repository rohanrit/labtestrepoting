import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import { Report } from '@/models/Report';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    const saved = await Report.create(body);
    return NextResponse.json({ success: true, report: saved });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}
