'use client';

import { useEffect, useState } from 'react';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
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
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error loading reports");
            }
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
            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Error deleting report");
            }
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <>
            <section className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">Upload Heamatology</h2>
                    <Link
                        href="/dashboard/heamatologyreport/add"
                        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                    >
                        Add Report
                    </Link>
                </div>
            </section>


            <section className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Heamatology Reports</h2>
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
                                <tr key={report._id} className="border-t">
                                    <td className="px-4 py-2">{report.animalName || '—'}</td>
                                    <td className="px-4 py-2">{report.horseId || '—'}</td>
                                    <td className="px-4 py-2">{report.testDate || '—'}</td>
                                    <td className="px-4 py-2">{report.mode || '—'}</td>
                                    <td className="px-4 py-2">{report.masterName || '—'}</td>
                                    <td className="px-4 py-2">
                                        <div className="flex gap-3">
                                            <Link href={`/dashboard/heamatologyreport/${report._id}`} className="flex items-center gap-1 text-blue-600 hover:underline" title="View"><EyeIcon className="w-5 h-5" /></Link>
                                            <button onClick={() => handleDelete(report._id)} className="flex items-center gap-1 text-red-600 hover:underline" title="Delete"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
