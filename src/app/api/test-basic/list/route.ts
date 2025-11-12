import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { TestBasic } from "@/models/TestBasic";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI as string);
}

export async function GET() {
  const tests = await TestBasic.find({});
  return NextResponse.json(tests);
}
