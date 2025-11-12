import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Report } from '@/models/Report';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const mode = url.searchParams.get('mode');

    if (!mode) {
      return NextResponse.json({ error: 'Mode is required' }, { status: 400 });
    }

    const reports = await Report.find({
      owner: session.user.id,
      mode: mode,
    }).sort({ testDate: -1 });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}
