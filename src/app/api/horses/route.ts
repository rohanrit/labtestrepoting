import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Horse } from '@/models/Horse';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
  await dbConnect();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });
  const horses = await Horse.find({ owner: session.user.id });
  return NextResponse.json(horses);
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name } = await req.json();

  const horse = new Horse({ name, owner: session.user.id });
  await horse.save();

  return NextResponse.json(horse);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  await Horse.deleteOne({ _id: id });

  return NextResponse.json({ success: true });
}
