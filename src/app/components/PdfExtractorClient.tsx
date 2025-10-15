'use client';

import { useState } from 'react';
import PdfExtractor from './PdfExtractor';

export default function PdfExtractorClient() {
  const [formattedData, setFormattedData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🧠 Handle extracted text and format it via API route
  const handleExtract = async (data: { text: string; meta: any }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/parseReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: data.text }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Formatting failed');
      }

      setFormattedData(JSON.stringify(result, null, 2));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error formatting data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* PDF extraction form */}
      <PdfExtractor onExtract={handleExtract} />

      {/* 🧩 Show AI formatted results */}
      {loading && (
        <p className="text-blue-600 font-medium">Formatting extracted data...</p>
      )}

      {error && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </p>
      )}

      {formattedData && (
        <div className="rounded border bg-white p-4 shadow-sm mt-4">
          <h3 className="text-lg font-medium mb-2">Formatted Results (AI)</h3>
          <pre className="whitespace-pre-wrap break-words text-sm bg-gray-100 p-3 rounded">
            {formattedData}
          </pre>
        </div>
      )}
    </div>
  );
}
