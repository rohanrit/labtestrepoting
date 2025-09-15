import React from "react";

export default function DataTable({ data }) {
  return (
    <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Result</th>
          <th>Units</th>
          <th>Ranges</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ id, testName, result, units, ranges, createdAt }) => (
          <tr key={id}>
            <td>{testName}</td>
            <td>{result}</td>
            <td>{units}</td>
            <td>{ranges}</td>
            <td>{new Date(createdAt).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
