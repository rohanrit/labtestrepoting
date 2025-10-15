'use client';

import { useEffect, useState } from 'react';
import PdfExtractor from './PdfExtractor';
import { redirect } from "next/navigation";

type TestResult = {
  item: string;
  value: string;
  unit?: string;
  range?: string;
};

type FormattedData = {
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

export default function PdfExtractorClient() {
  const [formattedData, setFormattedData] = useState<FormattedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (data: { text: string; meta: any }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/parseReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.text }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Formatting failed');
      }

      setFormattedData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error formatting data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormattedData, value: string) => {
    setFormattedData((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleResultChange = (index: number, value: string) => {
    setFormattedData((prev) => {
      if (!prev) return prev;
      const updatedResults = [...prev.results];
      updatedResults[index] = { ...updatedResults[index], value };
      return { ...prev, results: updatedResults };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/saveReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save report');
      }

      alert('Report saved successfully!');
      console.log('Saved report:', result.report);
      redirect("/dashboard/reports");
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error saving report');
    }
  };

  function toDateInputFormat(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  useEffect(() => {
    if (formattedData) {
      console.log('Formatted data:', JSON.stringify(formattedData, null, 2));
    }
  }, [formattedData]);

  return (
    <div className="flex flex-col gap-4">
      {/* Hide PDF upload once data is extracted */}
      {!formattedData && <PdfExtractor onExtract={handleExtract} />}

      {loading && <p className="text-blue-600 font-medium">Formatting extracted data...</p>}
      {error && <p className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</p>}

      {formattedData && (

        <form onSubmit={handleSubmit} className="rounded border bg-white p-4 shadow-sm mt-4 flex flex-col gap-4">
          <h3 className="text-lg font-medium mb-2">Edit Extracted Data</h3>

          <label>
            Mode:
            <input
              type="text"
              value={formattedData.mode || ''}
              onChange={(e) => handleChange('mode', e.target.value)}
              className="border p-1 rounded w-full"
            />
          </label>

          <label>
            Phone:
            <input
              type="tel"
              value={formattedData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="border p-1 rounded w-full"
            />
          </label>

          <label>
            Case ID:
            <input
              type="text"
              value={formattedData.caseId || ''}
              onChange={(e) => handleChange('caseId', e.target.value)}
              className="border p-1 rounded w-full"
            />
          </label>

          <label>
            Master Name:
            <input
              type="text"
              value={formattedData.masterName || ''}
              onChange={(e) => handleChange('masterName', e.target.value)}
              className="border p-1 rounded w-full"
            />
          </label>

          <label>
            Sex:
            <input
              type="text"
              value={formattedData.sex || ''}
              onChange={(e) => handleChange('sex', e.target.value)}
              className="border p-1 rounded w-full"
            />
          </label>

          <label>
            Age:
            <input
              type="number"
              value={formattedData.age || ''}
              onChange={(e) => handleChange('age', e.target.value)}
              className="border p-1 rounded w-full"
            />
          </label>

          <label>
            Animal Type:
            <input
              type="text"
              value={formattedData.animalType || ''}
              onChange={(e) => handleChange('animalType', e.target.value)}
              className="border p-1 rounded w-full"
            />
          </label>

          <label>
            Horse ID:
            <input
              type="text"
              value={formattedData.horseId || ''}
              onChange={(e) => handleChange('horseId', e.target.value)}
              className="border p-1 rounded w-full"
            />
          </label>

          <label>
            Animal Name:
            <input
              type="text"
              value={formattedData.animalName || ''}
              onChange={(e) => handleChange('animalName', e.target.value)}
              className="border p-1 rounded w-full"
            />
          </label>

          <label>
            Test Date:
            <input
              type="text"
              value={formattedData.testDate || ''}
              onChange={(e) => handleChange('testDate', e.target.value)}
              className="border p-1 rounded w-full"
            />
          </label>

          <h4 className="font-semibold mt-4">Test Results</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formattedData.results.map((result, index) => (
              <div key={index} className="border p-3 rounded bg-gray-50">
                <label className="font-medium text-sm mb-1 block">{result.item}</label>
                <input
                  type="text"
                  value={result.value}
                  onChange={(e) => handleResultChange(index, e.target.value)}
                  className="border p-1 rounded w-full mb-1"
                />
                <p className="text-xs text-gray-600">Unit: {result.unit || '—'}</p>
                <p className="text-xs text-gray-600">Range: {result.range || '—'}</p>
              </div>
            ))}
          </div>

          <button type="submit" className="bg-green-600 text-white p-2 rounded mt-4">
            Submit to Database
          </button>
        </form>
      )}
    </div>
  );
}
