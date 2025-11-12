import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { TestBasic } from "@/models/TestBasic";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI as string);
}

export async function POST(req: Request) {
  const data = await req.json();
  await TestBasic.findByIdAndUpdate(data._id, data, { new: true });
  return NextResponse.json({ success: true });
}
