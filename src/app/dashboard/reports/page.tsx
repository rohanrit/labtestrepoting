'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type TestResult = {
  item: string;
  value: string;
  unit?: string;
  range?: string;
};

type Report = {
  _id: string;
  animalName?: string;
  horseId?: string;
  testDate?: string;
  mode?: string;
  masterName?: string;
  phone?: number;
  sex?: string;
  age?: number;
  animalType?: string;
  results: TestResult[];
};

export default function ViewReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/getReports');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch reports');
      console.log("dr-", data.reports);
      setReports(data.reports);
    } catch (err: any) {
      setError(err.message || 'Error loading reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      const res = await fetch('/api/deleteReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete report');
      setReports((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Error deleting report');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Saved Reports</h2>

      {loading && <p>Loading reports...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Animal Name</th>
              <th className="px-4 py-2 text-left">Horse ID</th>
              <th className="px-4 py-2 text-left">Test Date</th>
              <th className="px-4 py-2 text-left">Mode</th>
              <th className="px-4 py-2 text-left">Owner</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t">
                <td className="px-4 py-2">{report.animalName || '—'}</td>
                <td className="px-4 py-2">{report.horseId || '—'}</td>
                <td className="px-4 py-2">{report.testDate || '—'}</td>
                <td className="px-4 py-2">{report.mode || '—'}</td>
                <td className="px-4 py-2">{report.masterName || '—'}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-3">
                    <Link href={`/dashboard/reports/${report._id}`} className="text-blue-600 underline">View</Link>
                    <button onClick={() => handleDelete(report._id)} className="text-red-600 underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
