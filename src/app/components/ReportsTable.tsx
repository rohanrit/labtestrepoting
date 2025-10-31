'use client';

import Link from 'next/link';
import React from 'react';

type TestResult = {
  item: string;
  value: string;
  unit?: string;
  range?: string;
};

type Report = {
  _id: string;
  horseName?: string;
  testDate?: string;
  mode?: string;
  results: TestResult[];
};

type Props = {
  reports: Report[];
  onDelete: (id: string) => void;
};

export default function ReportsTable({ reports, onDelete }: Props) {
  if (!reports.length) return <p>No reports available.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Animal Name</th>
            <th className="px-4 py-2 text-left">Test Date</th>
            <th className="px-4 py-2 text-left">Mode</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id} className="border-t">
              <td className="px-4 py-2">{report.horseName || '—'}</td>
              <td className="px-4 py-2">{report.testDate ? new Date(report.testDate).toLocaleDateString() : '—'}</td>
              <td className="px-4 py-2">{report.mode || '—'}</td>
              <td className="px-4 py-2">
                <div className="flex gap-3">
                  <Link href={`/dashboard/reports/${report._id}`} className="text-blue-600 underline">View</Link>
                  <button onClick={() => onDelete(report._id)} className="text-red-600 underline">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
