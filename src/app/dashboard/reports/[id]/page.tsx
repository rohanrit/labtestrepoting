'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type TestResult = {
  item: string;
  value: string;
  unit?: string;
  range?: string;
};

type Report = {
  id: string;
  mode?: string;
  phone?: number;
  caseId?: string;
  masterName?: string;
  sex?: string;
  age?: number;
  animalType?: string;
  horseId?: string;
  animalName?: string;
  testDate?: string;
  results: TestResult[];
};

export default function ViewReportForm() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/getReports?id=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch report');
        setReport(data.report);
      } catch (err: any) {
        setError(err.message || 'Error loading report');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReport();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Report submitted for review!');
    // You can trigger an API call here if needed
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">View Report</h2>

      {loading && <p>Loading report...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {report && (
        <form onSubmit={handleSubmit} className="rounded border bg-white p-4 shadow-sm flex flex-col gap-4">
          <label>
            Mode:
            <input type="text" value={report.mode || ''} disabled className="border p-1 rounded w-full" />
          </label>

          <label>
            Phone:
            <input type="tel" value={report.phone || ''} disabled className="border p-1 rounded w-full" />
          </label>

          <label>
            Case ID:
            <input type="text" value={report.caseId || ''} disabled className="border p-1 rounded w-full" />
          </label>

          <label>
            Master Name:
            <input type="text" value={report.masterName || ''} disabled className="border p-1 rounded w-full" />
          </label>

          <label>
            Sex:
            <input type="text" value={report.sex || ''} disabled className="border p-1 rounded w-full" />
          </label>

          <label>
            Age:
            <input type="number" value={report.age || ''} disabled className="border p-1 rounded w-full" />
          </label>

          <label>
            Animal Type:
            <input type="text" value={report.animalType || ''} disabled className="border p-1 rounded w-full" />
          </label>

          <label>
            Horse ID:
            <input type="text" value={report.horseId || ''} disabled className="border p-1 rounded w-full" />
          </label>

          <label>
            Animal Name:
            <input type="text" value={report.animalName || ''} disabled className="border p-1 rounded w-full" />
          </label>

          <label>
            Test Date:
            <input type="text" value={report.testDate || ''} disabled className="border p-1 rounded w-full" />
          </label>

          <h4 className="font-semibold mt-4">Test Results</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.results.map((result, index) => (
              <div key={index} className="border p-3 rounded bg-gray-50">
                <label className="font-medium text-sm mb-1 block">{result.item}</label>
                <input
                  type="text"
                  value={result.value}
                  disabled
                  className="border p-1 rounded w-full mb-1"
                />
                <p className="text-xs text-gray-600">Unit: {result.unit || '—'}</p>
                <p className="text-xs text-gray-600">Range: {result.range || '—'}</p>
              </div>
            ))}
          </div>

          {/* <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-4">
            Submit Report
          </button> */}
        </form>
      )}
    </div>
  );
}
