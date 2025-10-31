import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Report } from "@/models/Report";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Parser } from "json2csv";

type ReportResult = {
  item: string;
  value: string | number;
  unit?: string;
};

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { horseId, startDate, endDate, mode } = await req.json();

    if (!horseId)
      return NextResponse.json(
        { error: "Horse ID is required" },
        { status: 400 }
      );
    if (!startDate || !endDate)
      return NextResponse.json(
        { error: "Start and end dates are required" },
        { status: 400 }
      );

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const reports = await Report.find({
      owner: session.user.id,
      horseId,
      mode,
      testDate: { $gte: start, $lte: end },
    }).lean();

    if (!reports.length) {
      return NextResponse.json(
        { error: "No reports found for the selected period" },
        { status: 404 }
      );
    }

    const dataToExport = reports.map((r) => ({
      animalName: r.animalName,
      horseId: r.horseId,
      testDate: r.testDate.toISOString().split("T")[0],
      mode: r.mode,
      results: r.results
        .map(
          (res: ReportResult) => `${res.item}: ${res.value} ${res.unit || ""}`
        )
        .join("; "),
    }));

    const parser = new Parser();
    const csv = parser.parse(dataToExport);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=${mode}_${horseId}_${startDate}_${endDate}.csv`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to export reports" },
      { status: 500 }
    );
  }
}
