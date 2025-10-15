import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { id } = await req.json();

  // Replace with actual DB logic
  console.log('Deleting report with ID:', id);

  return NextResponse.json({ success: true });
}
