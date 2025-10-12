import { connectMongo } from "@/lib/mongoose";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import Report from "@/models/Report";
import Horse from "@/models/Horse";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectMongo();

  const report = await Report.findById(params.id).populate("horse");
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role === "DOCTOR")
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  if (session.user.role === "USER" && report.horse.userId.toString() !== session.user.id)
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });

  await Report.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
