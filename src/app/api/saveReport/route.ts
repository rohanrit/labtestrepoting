import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Report } from "@/models/Report";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type ReportResult = {
  item?: string;
  value?: string;
  unit?: string;
  range?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await dbConnect();

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !body.horseName ||
      typeof body.horseName !== "string" ||
      !body.horseName.trim()
    ) {
      return NextResponse.json(
        { error: "Invalid horse name" },
        { status: 400 }
      );
    }
    body.horseName = body.horseName.trim();

    if (body.testDate) {
      let dateObj: Date;

      if (typeof body.testDate === "string") {
        const parts = body.testDate.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            dateObj = new Date(body.testDate);
          } else {
            const [day, month, year] = parts;
            dateObj = new Date(`${year}-${month}-${day}`);
          }
        } else {
          dateObj = new Date(body.testDate);
        }
      } else if (body.testDate instanceof Date) {
        dateObj = body.testDate;
      } else {
        dateObj = new Date();
      }

      if (isNaN(dateObj.getTime())) {
        console.warn(
          `Invalid testDate received: "${body.testDate}", using current date.`
        );
        dateObj = new Date();
      }

      body.testDate = dateObj;
    } else {
      body.testDate = new Date();
    }

    body.owner = session.user.id;
    if (Array.isArray(body.results)) {
      body.results = body.results.map((r: ReportResult) => ({
        item: r.item?.trim() || "",
        value: r.value?.trim() || "",
        unit: r.unit?.trim() || undefined,
        range: r.range?.trim() || undefined,
      }));
    } else {
      body.results = [];
    }

    const saved = await Report.create(body);
    return NextResponse.json({ success: true, report: saved });
  } catch (error) {
    console.error("Save error:", error);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}
