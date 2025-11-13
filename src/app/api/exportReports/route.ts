import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Report } from "@/models/Report";
import { Horse } from "@/models/Horse";
import { TestBasic } from "@/models/TestBasic";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Parser } from "json2csv";

/* -------------------------------------------------------------------------- */
/* 🧩 1️⃣ FETCH DATA */
/* -------------------------------------------------------------------------- */
async function fetchReportData(req: Request) {
  await dbConnect();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw { status: 401, message: "Unauthorized" };

  const url = new URL(req.url);
  const view = url.searchParams.get("view") === "true";

  const { horseId, startDate, endDate, mode = "both" } = await req.json();

  if (!horseId) throw { status: 400, message: "Horse ID is required" };
  if (!startDate || !endDate)
    throw { status: 400, message: "Start and end dates are required" };

  const horse = await Horse.findOne({ _id: horseId, owner: session.user.id });
  if (!horse) throw { status: 404, message: "Horse not found or not owned by user" };

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()))
    throw { status: 400, message: "Invalid date format" };

  let modeFilter: Record<string, any> = {};
  if (mode === "heamatology") modeFilter = { mode: "heamatology" };
  else if (mode === "chemistry") modeFilter = { mode: "chemistry" };

  const reports = await Report.find({
    owner: session.user.id,
    horseName: horse.name,
    testDate: { $gte: start, $lte: end },
    ...modeFilter,
  }).lean();

  if (!reports.length)
    throw { status: 404, message: "No reports found for the selected period" };

  const testBasics = await TestBasic.find().lean();

  console.log(
    "✅ TestBasics fetched:",
    testBasics.map((t) => ({
      abbreviation: t.abbreviation,
      name: t.testName,
      unit: t.unit,
      rangeLow: t.rangeLow,
      rangeHigh: t.rangeHigh,
    }))
  );

  return { reports, testBasics, horseName: horse.name, startDate, endDate, mode, view };
}

/* -------------------------------------------------------------------------- */
/* 🧮 2️⃣ FORMAT & REARRANGE DATA (sorted by abbreviation) */
/* -------------------------------------------------------------------------- */
function formatReportData({
  reports,
  testBasics,
  horseName,
}: {
  reports: any[];
  testBasics: any[];
  horseName: string;
}) {
  // Preferred abbreviation order (not full names)
  const preferredOrder = [
    "HGB", "RBC", "HCT", "MCV", "MCH", "MCHC", "PLT",
    "WBC", "NEU%", "LYM%", "MON%", "EOS%", "BASO%",
    "NEU#", "LYM#", "MON#", "EOS#", "BASO#",
    "RDW_CV", "MPV",
    "Na", "K", "Na/K", "Cl", "tCO2",
    "BUN", "CRE", "BUN/CRE",
    "CK", "AST", "ALT", "AST/ALT",
    "TP", "ALB", "GLO", "A/G", "TBIL", "GGT", "ALP", "TBA",
    "TG", "CHOL", "GLU", "Ca", "P", "Ca*P", "Mg", "AMY", "SAA"
  ];

  // Map abbreviation → metadata
  const testMap: Record<
    string,
    { name: string; unit?: string; rangeLow?: string; rangeHigh?: string }
  > = {};
  for (const tb of testBasics) {
    testMap[tb.abbreviation] = {
      name: tb.testName,
      unit: tb.unit,
      rangeLow: tb.rangeLow,
      rangeHigh: tb.rangeHigh,
    };
  }

  // Extract unique test dates
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

  // Header row
  const headerRow: Record<string, string> = {
    HorseName: "Horse Name",
    Item: "Item (Full Name)",
    Unit: "Unit",
    Range: "Range (Low-High)",
  };
  for (const date of uniqueDates) headerRow[date] = date;

  // Build rows
  for (const item of Object.keys(itemMap)) {
    const testInfo = testMap[item];
    const displayName = testInfo ? `${testInfo.name} (${item})` : item;
    const rangeText =
      testInfo?.rangeLow && testInfo?.rangeHigh
        ? `${testInfo.rangeLow} - ${testInfo.rangeHigh}`
        : "";

    const row: Record<string, string> = {
      HorseName: horseName,
      Item: displayName,
      Unit: testInfo?.unit || unitMap[item] || "",
      Range: rangeText,
    };

    for (const date of uniqueDates) {
      row[date] = itemMap[item][date] || "";
    }

    csvRows.push(row);
  }

  // Sort rows by abbreviation order
  csvRows.sort((a, b) => {
    const abbrA = a.Item.match(/\((.*?)\)$/)?.[1] || a.Item;
    const abbrB = b.Item.match(/\((.*?)\)$/)?.[1] || b.Item;

    const idxA = preferredOrder.indexOf(abbrA);
    const idxB = preferredOrder.indexOf(abbrB);

    if (idxA === -1 && idxB === -1) return a.Item.localeCompare(b.Item);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return { csvRows, headerRow, uniqueDates };
}

/* -------------------------------------------------------------------------- */
/* 📤 3️⃣ EXPORT OR VIEW DATA */
/* -------------------------------------------------------------------------- */
function exportOrViewData({
  csvRows,
  headerRow,
  horseName,
  startDate,
  endDate,
  mode,
  view,
}: {
  csvRows: Record<string, string>[];
  headerRow: Record<string, string>;
  horseName: string;
  startDate: string;
  endDate: string;
  mode: string;
  view: boolean;
}) {
  if (view) {
    return NextResponse.json({ data: csvRows }, { status: 200 });
  }

  const parser = new Parser({ fields: Object.keys(headerRow) });
  const csv = parser.parse(csvRows);
  const safeHorseName = horseName.replace(/\s+/g, "_");
  const filename = `${safeHorseName}_${startDate}_${endDate}_${mode}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${filename}`,
    },
  });
}

/* -------------------------------------------------------------------------- */
/* 🚀 MAIN ENTRY POINT */
/* -------------------------------------------------------------------------- */
export async function POST(req: Request) {
  try {
    const { reports, testBasics, horseName, startDate, endDate, mode, view } =
      await fetchReportData(req);

    const { csvRows, headerRow } = formatReportData({
      reports,
      testBasics,
      horseName,
    });

    return exportOrViewData({
      csvRows,
      headerRow,
      horseName,
      startDate,
      endDate,
      mode,
      view,
    });
  } catch (err: any) {
    console.error("Export error:", err);
    const status = err?.status || 500;
    const message = err?.message || "Failed to export reports";
    return NextResponse.json({ error: message }, { status });
  }
}
