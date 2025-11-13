import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Report } from "@/models/Report";
import { Horse } from "@/models/Horse";
import { TestBasic } from "@/models/TestBasic";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { exportCsv } from "@/lib/exportCsv";
import { exportExcel } from "@/lib/exportExcel";

interface Session {
  user?: {
    id: string;
  };
}

interface ReportResult {
  item: string;
  value?: string | number;
  unit?: string;
}

interface ReportDoc {
  _id: string;
  horseName: string;
  owner: string;
  testDate: Date;
  results: ReportResult[];
  mode: "heamatology" | "chemistry" | "both";
}

interface TestBasicDoc {
  abbreviation: string;
  testName: string;
  unit?: string;
  rangeLow?: string;
  rangeHigh?: string;
}

async function fetchReportData(req: Request) {
  await dbConnect();

  const session: Session | null = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw { status: 401, message: "Unauthorized" };

  const url = new URL(req.url);
  const view = url.searchParams.get("view") === "true";

  const body: { horseId: string; startDate: string; endDate: string; mode?: "heamatology" | "chemistry" | "both" } = await req.json();
  const { horseId, startDate, endDate, mode = "both" } = body;

  if (!horseId) throw { status: 400, message: "Horse ID is required" };
  if (!startDate || !endDate) throw { status: 400, message: "Start and end dates are required" };

  const horse = await Horse.findOne({ _id: horseId, owner: session.user.id });
  if (!horse) throw { status: 404, message: "Horse not found or not owned by user" };

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) throw { status: 400, message: "Invalid date format" };

  const modeFilter: Partial<ReportDoc> = {};
  if (mode === "heamatology") modeFilter.mode = "heamatology";
  else if (mode === "chemistry") modeFilter.mode = "chemistry";

  const reports = await Report.find({
    owner: session.user.id,
    horseName: horse.name,
    testDate: { $gte: start, $lte: end },
    ...modeFilter,
  }).lean<ReportDoc[]>();

  if (!reports.length) throw { status: 404, message: "No reports found for the selected period" };

  const testBasics = await TestBasic.find().lean<TestBasicDoc[]>();

  return { reports, testBasics, horseName: horse.name, startDate, endDate, mode, view };
}

function formatReportData({
  reports,
  testBasics,
  horseName,
}: {
  reports: ReportDoc[];
  testBasics: TestBasicDoc[];
  horseName: string;
}) {
  const preferredOrder = [
    "HGB","RBC","HCT","MCV","MCH","MCHC","PLT","WBC","NEU%","LYM%","MON%","EOS%","BASO%",
    "NEU#","LYM#","MON#","EOS#","BASO#","RDW_CV","MPV","Na","K","Na/K","Cl","tCO2","BUN",
    "CRE","BUN/CRE","CK","AST","ALT","AST/ALT","TP","ALB","GLO","A/G","TBIL","GGT","ALP",
    "TBA","TG","CHOL","GLU","Ca","P","Ca*P","Mg","AMY","SAA",
  ];

  const testMap: Record<string, { name: string; unit?: string; rangeLow?: string; rangeHigh?: string }> = {};
  for (const tb of testBasics) {
    testMap[tb.abbreviation] = { name: tb.testName, unit: tb.unit, rangeLow: tb.rangeLow, rangeHigh: tb.rangeHigh };
  }

  const uniqueDates = [...new Set(reports.map(r => r.testDate.toISOString().split("T")[0]))].sort();
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
  const headerRow: Record<string, string> = { HorseName: "Horse Name", Item: "Item", Unit: "Unit", Range: "Range (Low-High)" };
  uniqueDates.forEach(d => headerRow[d] = d);

  for (const item of Object.keys(itemMap)) {
    const testInfo = testMap[item];
    const displayName = testInfo ? `${testInfo.name} (${item})` : item;
    const rangeText = testInfo?.rangeLow && testInfo?.rangeHigh ? `${testInfo.rangeLow} - ${testInfo.rangeHigh}` : "";
    const row: Record<string, string> = {
      HorseName: horseName,
      Item: displayName,
      Unit: testInfo?.unit || unitMap[item] || "",
      Range: rangeText,
    };
    for (const date of uniqueDates) row[date] = itemMap[item][date] || "";
    csvRows.push(row);
  }

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

export async function POST(req: Request) {
  try {
    const { reports, testBasics, horseName, startDate, endDate, mode } = await fetchReportData(req);
    const { csvRows, headerRow } = formatReportData({ reports, testBasics, horseName });

    const url = new URL(req.url);
    const format = url.searchParams.get("format") || "csv";

    if (format === "xlsx") {
      return await exportExcel({ csvRows, headerRow, horseName, startDate, endDate, mode });
    } else {
      return exportCsv({ csvRows, headerRow, horseName, startDate, endDate, mode });
    }

  } catch (err: unknown) {
    console.error("Export error:", err);

    let status = 500;
    let message = "Failed to export reports";

    if (typeof err === "object" && err !== null && "status" in err && "message" in err) {
      const e = err as { status: number; message: string };
      status = e.status;
      message = e.message;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
