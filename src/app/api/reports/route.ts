import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Report from "@/models/Report";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectMongo();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user.role;
  const userId = session.user.id;

  let reports;
  if (role === "ADMIN" || role === "DOCTOR") {
    reports = await Report.find().populate("horse");
  } else {
    reports = await Report.find({ uploadedBy: userId }).populate("horse");
  }

  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const newReport = new Report({
    ...data,
    uploadedBy: session.user.id,
    role: session.user.role,
  });
  await newReport.save();

  return NextResponse.json(newReport);
}
