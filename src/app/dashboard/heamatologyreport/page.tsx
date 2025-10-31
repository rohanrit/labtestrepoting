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
    horseName?: string;
    horseId?: string;
    testDate?: string;
    mode?: string;
    results: TestResult[];
};

type Horse = {
    _id: string;
    name: string;
};

export default function HeamatologyReportsSection() {
    const [reports, setReports] = useState<Report[]>([]);
    const [horses, setHorses] = useState<Horse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [resReports, resHorses] = await Promise.all([
                fetch('/api/getReports?mode=heamatology'),
                fetch('/api/horses'),
            ]);

            const reportsData = await resReports.json();
            const horsesData = await resHorses.json();

            if (!resReports.ok) throw new Error(reportsData.error || 'Failed to fetch reports');
            if (!resHorses.ok) throw new Error('Failed to fetch horses');

            setReports(reportsData.reports || []);
            setHorses(horsesData || []);
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Error loading data');
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
            setReports((prev) => prev.filter((r) => r._id !== id));
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Error deleting report');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <section className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Heamatology Reports</h2>
                <Link
                    href="/dashboard/heamatologyreport/add"
                    className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                >
                    Add Report
                </Link>
            </div>

            {loading && <p>Loading reports...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Horse Name</th>
                                <th className="px-4 py-2 text-left">Test Date</th>
                                {/* <th className="px-4 py-2 text-left">Results</th> */}
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report._id} className="border-t">
                                    <td className="px-4 py-2">{
                                        report.horseName ||
                                        horses.find((h) => h._id === report._id)?.name || '—'
                                    }</td>
                                    <td className="px-4 py-2">
                                        {report.testDate
                                            ? new Date(report.testDate).toLocaleDateString()
                                            : '—'}
                                    </td>
                                    {/* <td className="px-4 py-2">
                    {report.results
                      .map((r) => `${r.item}: ${r.value} ${r.unit || ''}`)
                      .join('; ')}
                  </td> */}
                                    <td className="px-4 py-2">
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/dashboard/heamatologyreport/${report._id}`}
                                                className="text-blue-600 underline"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(report._id)}
                                                className="text-red-600 underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                                        No reports found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
