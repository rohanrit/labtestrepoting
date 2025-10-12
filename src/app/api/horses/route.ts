import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import Horse from "@/models/Horse";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectMongo();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = session.user.role;
  const userId = session.user.id;

  let horses;
  if (role === "ADMIN" || role === "DOCTOR") {
    horses = await Horse.find().populate("createdBy", "name email");
  } else {
    horses = await Horse.find({ createdBy: userId }).populate("createdBy", "name email");
  }

  return NextResponse.json(horses);
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const newHorse = new Horse({
    ...data,
    createdBy: session.user.id,
  });
  await newHorse.save();

  return NextResponse.json(newHorse);
}
