import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Report } from "@/models/Report";
import { Horse } from "@/models/Horse";
import { TestBasic } from "@/models/TestBasic";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Parser } from "json2csv";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { horseId, startDate, endDate, mode = "both" } = await req.json();

    if (!horseId) {
      return NextResponse.json({ error: "Horse ID is required" }, { status: 400 });
    }
    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 });
    }

    const horse = await Horse.findOne({ _id: horseId, owner: session.user.id });
    if (!horse) {
      return NextResponse.json({ error: "Horse not found or not owned by user" }, { status: 404 });
    }

    const horseName = horse.name;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    let modeFilter = {};
  if (mode === 'heamatology') {
    modeFilter = { mode: 'heamatology' };
  } else if (mode === 'chemistry') {
    modeFilter = { mode: 'chemistry' };
  } else {
    modeFilter = {}; 
  }

    const reports = await Report.find({
      owner: session.user.id,
      horseName,
      testDate: { $gte: start, $lte: end },
      ...modeFilter,
    }).lean();

    if (!reports.length) {
      return NextResponse.json({ error: "No reports found for the selected period" }, { status: 404 });
    }

    const testBasics = await TestBasic.find().lean();
    const itemNameMap: Record<string, string> = {};
    for (const tb of testBasics) {
      itemNameMap[tb.abbreviation] = tb.testName;
    }

    const uniqueDates = [
      ...new Set(reports.map((r) => r.testDate.toISOString().split("T")[0])),
    ].sort();

    const itemMap: Record<string, Record<string, string>> = {};
    const unitMap: Record<string, string> = {};

    for (const report of reports) {
      const dateStr = report.testDate.toISOString().split("T")[0];
      for (const res of report.results) {
        const itemKey = res.item;
        if (!itemMap[itemKey]) itemMap[itemKey] = {};
        itemMap[itemKey][dateStr] = String(res.value ?? "");
        if (res.unit) unitMap[itemKey] = res.unit;
      }
    }

    const csvRows: Record<string, string>[] = [];

    const headerRow: Record<string, string> = {
      HorseName: "Horse Name",
      Item: "Item",
      Unit: "Unit",
    };
    for (const date of uniqueDates) headerRow[date] = date;

    for (const item of Object.keys(itemMap)) {
      const fullName = itemNameMap[item] ? `${itemNameMap[item]} (${item})` : item;
      const row: Record<string, string> = {
        HorseName: horseName,
        Item: fullName,
        Unit: unitMap[item] || "",
      };
      for (const date of uniqueDates) {
        row[date] = itemMap[item][date] || "";
      }
      csvRows.push(row);
    }

    const parser = new Parser({ fields: Object.keys(headerRow) });
    const csv = parser.parse(csvRows);

    const safeHorseName = horseName.replace(/\s+/g, "_");
    const filename = `${safeHorseName}_${startDate}_${endDate}_${mode}`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=${filename}.csv`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Failed to export reports" }, { status: 500 });
  }
}
