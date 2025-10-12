"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ReportList({ role }: { role: string }) {
  const { data: reports, error, mutate } = useSWR("/api/reports", fetcher);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;

    const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
    if (res.ok) mutate();
  }

  if (error) return <p>Error loading reports</p>;
  if (!reports) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports</h2>

      {reports.length === 0 && <p>No reports found.</p>}

      <div className="grid gap-4">
        {reports.map((r: any) => (
          <div
            key={r._id}
            className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Type:</strong> {r.type}
              </p>
              <p>
                <strong>Horse:</strong> {r.horse?.name || "Unknown"}
              </p>
              <p className="text-sm text-gray-600">
                {r.description || "No description"}
              </p>
            </div>

            {(role === "ADMIN" || role === "USER") && (
              <button
                onClick={() => handleDelete(r._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
