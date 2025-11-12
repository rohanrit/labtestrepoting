import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { TestBasic } from "@/models/TestBasic";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI as string);
}

// PUT - update
export async function PUT(req: Request, { params }: any) {
  const { id } = params;
  const body = await req.json();
  const updated = await TestBasic.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

// DELETE - remove
export async function DELETE(_: Request, { params }: any) {
  const { id } = params;
  await TestBasic.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
