import React from "react";

export interface LabResult {
  testName: string;
  result: string;
  units: string;
  ranges?: string;
  createdAt?: string;
  // Optionally patient info fields
  patientName?: string;
  species?: string;
}

interface DataTableProps {
  data: LabResult[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (!data.length) {
    return <p>No data available.</p>;
  }

  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        marginTop: "1rem",
      }}
    >
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Test Name</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Result</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Units</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Ranges</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Patient</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Species</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i}>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.testName}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.result}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.units}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.ranges || "-"}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.patientName || "-"}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.species || "-"}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {row.createdAt ? new Date(row.createdAt).toLocaleString() : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
