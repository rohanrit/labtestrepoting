'use client'

import { useState, ChangeEvent } from "react";
import DownloadJsonButton from "./DownloadJsonButton";

interface LabResult {
  testName: string;
  result: string;
  units: string;
  ranges?: string;
}

export default function UploadForm() {
  const [jsonData, setJsonData] = useState<LabResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    const res = await fetch("/api/extract", {
      method: "POST",
      body: await file.arrayBuffer(),
    });
    let json: { data?: LabResult[]; error?: string } | null = null;
    try {
      // if response has no content, avoid calling res.json()
      const text = await res.text();
      json = text ? JSON.parse(text) : null;
    } catch (e) {
      // fallback to res.json() for well-formed JSON responses
      try {
        const parsed = await res.json();
        json = parsed;
      } catch (_) {
        json = { error: "Invalid JSON response from server" };
      }
    }
    setJsonData(json?.data || null);
    setLoading(false);
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={onFileChange} />
      {loading && <p>Processing...</p>}
      {jsonData && (
        <>
          <h3>Extracted JSON</h3>
          <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          <DownloadJsonButton data={jsonData} />
        </>
      )}
    </div>
  );
}
