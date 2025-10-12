"use client";
import { useState, useEffect } from "react";

export default function ReportUploader() {
  const [horses, setHorses] = useState([]);
  const [form, setForm] = useState({
    horseId: "",
    type: "",
    description: "",
    file: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/horses")
      .then((res) => res.json())
      .then(setHorses)
      .catch(() => setHorses([]));
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!form.file) return setMessage("Please select a file");

    setLoading(true);
    setMessage("");

    // Simulate file upload: in production use S3/Cloudinary
    const fileUrl = `/uploads/${form.file.name}`;

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        horseId: form.horseId,
        type: form.type,
        description: form.description,
        fileUrl,
      }),
    });

    const data = await res.json();
    if (res.ok) setMessage("Report uploaded successfully!");
    else setMessage(data.error || "Error uploading report");
    setLoading(false);
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <h2 className="text-xl font-semibold">Upload Report</h2>

      <select
        className="w-full border rounded p-2"
        value={form.horseId}
        onChange={(e) => setForm({ ...form, horseId: e.target.value })}
        required
      >
        <option value="">Select Horse</option>
        {horses.map((h: any) => (
          <option key={h._id} value={h._id}>
            {h.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Report type (Blood, Chemical...)"
        className="w-full border rounded p-2"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        required
      />

      <textarea
        placeholder="Description (optional)"
        className="w-full border rounded p-2"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="file"
        accept="application/pdf"
        className="w-full border rounded p-2"
        onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
      />

      <button
        disabled={loading}
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? "Uploading..." : "Upload Report"}
      </button>

      {message && <p className="text-sm text-gray-700">{message}</p>}
    </form>
  );
}
