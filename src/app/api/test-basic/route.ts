import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { TestBasic } from "@/models/TestBasic";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI as string);
}

// GET - list all tests
export async function GET() {
  const tests = await TestBasic.find().sort({ testName: 1 });
  return NextResponse.json(tests);
}

// POST - add a new test
export async function POST(req: Request) {
  const body = await req.json();
  const test = await TestBasic.create(body);
  return NextResponse.json(test);
}
