import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function exportExcel({
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
  const headers = Object.values(headerRow);
  const data: (string | number)[][] = [headers];

  for (const row of csvRows) {
    const rowData = Object.values(row);
    data.push(rowData);
  }

  const ws = XLSX.utils.aoa_to_sheet(data);

  headers.forEach((_, colIdx) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (!ws[cellRef]) ws[cellRef] = { t: "s", v: headers[colIdx] };
    ws[cellRef].s = {
      font: { bold: true, color: { rgb: "000000" } },
    };
  });

  const rangeColIdx = headers.indexOf("Range (Low-High)");

  for (let r = 1; r < data.length; r++) {
    const rangeText = data[r][rangeColIdx] as string;
    if (!rangeText) continue;

    const [lowStr, highStr] = rangeText.split("-").map((v) => v.trim());
    const low = parseFloat(lowStr);
    const high = parseFloat(highStr);
    if (isNaN(low) || isNaN(high)) continue;

    for (let c = 4; c < data[r].length; c++) {
      const val = parseFloat(data[r][c] as string);
      if (isNaN(val)) continue;

      const cellRef = XLSX.utils.encode_cell({ r, c });
      if (!ws[cellRef]) ws[cellRef] = { t: "n", v: val };

      let fontColor = undefined;
      if (val > high) fontColor = "FF0000";
      else if (val < low) fontColor = "0000FF";

      if (fontColor) {
        ws[cellRef].s = {
          font: { color: { rgb: fontColor } },
        };
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");

  const wbout = XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx",
    cellStyles: true,
  });

  const safeHorseName = horseName.replace(/\s+/g, "_");
  const filename = `${safeHorseName}_${startDate}_${endDate}_${mode}.xlsx`;

  return new NextResponse(wbout, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=${filename}`,
    },
  });
}
