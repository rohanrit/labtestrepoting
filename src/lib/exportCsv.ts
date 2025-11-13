import { NextResponse } from "next/server";
import { Parser } from "json2csv";

export function exportCsv({
  csvRows,
  headerRow,
  horseName,
  startDate,
  endDate,
  mode,
}: {
  csvRows: Record<string, string>[];
  headerRow: Record<string, string>;
  horseName: string;
  startDate: string;
  endDate: string;
  mode: string;
}) {
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
