import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <>
            <section className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">Upload Chemistry</h2>
                    <Link
                        href="/dashboard/chemistryreport/add"
                        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                    >
                        Add Report
                    </Link>
                </div>
            </section>


            <section className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Chemistry Reports</h2>

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
                            <tr className="border-t">
                                <td className="px-4 py-2">-</td>
                                <td className="px-4 py-2">-</td>
                                <td className="px-4 py-2">-</td>
                                <td className="px-4 py-2">-</td>
                                <td className="px-4 py-2">-</td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-3">
                                        <Link href={`/dashboard/reports/`} className="text-blue-600 underline">View</Link>
                                        <button className="text-red-600 underline">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

export default page