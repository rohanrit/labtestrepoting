'use client';

import { useEffect, useState } from 'react';
import PdfExtractor from './PdfExtractor';
import { redirect } from 'next/navigation';

type TestResult = {
  item: string;
  value: string;
  unit?: string;
  range?: string;
};

type FormattedData = {
  mode: 'heamatology';
  horseName?: string;
  testDate?: string;
  results: TestResult[];
};

type Horse = {
  _id: string;
  name: string;
};

export default function PdfExtractorClient({
  category,
  sectitle,
}: {
  category: 'heamatology' | 'chemistry';
  sectitle: string;
}) {
  const [formattedData, setFormattedData] = useState<FormattedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loadingHorses, setLoadingHorses] = useState(true);

  // ✅ Fetch user's horses
  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const res = await fetch('/api/horses');
        if (!res.ok) throw new Error('Failed to fetch horses');
        const data = await res.json();
        setHorses(data);
      } catch (err) {
        console.error('Error fetching horses:', err);
        setError('Failed to load horses');
      } finally {
        setLoadingHorses(false);
      }
    };
    fetchHorses();
  }, []);

  const handleExtract = async (data: { text: string; meta: unknown }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/parseReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.text }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Formatting failed');

      setFormattedData({ ...result, mode: category });
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error formatting data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingHorses && horses.length > 0 && formattedData && !formattedData.horseName) {
      setFormattedData((prev) =>
        prev ? { ...prev, horseName: horses[0].name } : prev
      );
    }
  }, [horses, loadingHorses, formattedData]);

  const sanitizeDate = (dateStr: string): string => {
    if (!dateStr) return '';

    const cleaned = dateStr.replace(/[^0-9-]/g, '');

    const parts = cleaned.split('-');
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      if (dd.length === 2 && yyyy.length === 4) {
        return `${yyyy}-${mm}-${dd}`;
      }
    }
    return cleaned;
  };

  const handleChange = (field: keyof FormattedData, value: string) => {
    let newValue = value;

    if (field === 'testDate') {
      if (!value) {
        newValue = '';
      } else {
        const formatted = sanitizeDate(value);
        const dateObj = new Date(formatted);

        if (!isNaN(dateObj.getTime())) {
          newValue = dateObj.toISOString().split('T')[0];
        } else {
          newValue = '';
        }
      }
    }

    setFormattedData((prev) =>
      prev ? { ...prev, [field]: newValue } : prev
    );
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

    if (!formattedData?.horseName) {
      alert('Please select an Animal Name before submitting.');
      return;
    }

    try {
      const response = await fetch('/api/saveReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save report');

      alert('Report saved successfully!');
      redirect('/dashboard');
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Error saving report');
    }
  };

  useEffect(() => {
    if (formattedData) {
      console.log('Formatted data:', JSON.stringify(formattedData, null, 2));
    }
  }, [formattedData]);

  return (
    <div className="flex flex-col gap-4">
      {!formattedData && <PdfExtractor onExtract={handleExtract} sectitle={sectitle} />}

      {loading && <p className="text-blue-600 font-medium">Formatting extracted data...</p>}
      {error && (
        <p className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</p>
      )}

      {formattedData && (
        <form
          onSubmit={handleSubmit}
          className="rounded border bg-white p-4 shadow-sm mt-4 flex flex-col gap-4"
        >
          <h2 className="text-xl font-medium mb-2">Edit Extracted Data</h2>

          <input
            type="hidden"
            name="mode"
            value="heamatology"
          />

          <label>
            Horse Name <span className="text-red-500">*</span>
            {loadingHorses ? (
              <p className="text-sm text-gray-500 mt-1">Loading horses...</p>
            ) : (
              <select
                required
                value={formattedData.horseName || ''}
                onChange={(e) => handleChange('horseName', e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select a horse</option>
                {horses.map((horse) => (
                  <option key={horse._id} value={horse.name}>
                    {horse.name}
                  </option>
                ))}
              </select>
            )}
          </label>

          <label>
            Test Date:
            <input
              type="date"
              value={formattedData.testDate || ''}   // null-safe binding
              onChange={(e) => handleChange('testDate', e.target.value)}
              className="border p-2 rounded w-full"
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

          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded mt-4 hover:bg-green-700"
          >
            Submit to Database
          </button>
        </form>
      )}
    </div>
  );
}
