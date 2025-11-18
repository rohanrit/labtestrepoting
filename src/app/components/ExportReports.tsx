'use client';

import { useEffect, useState } from 'react';

type Horse = { _id: string; name: string; };

export default function ExportReports() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [selectedHorse, setSelectedHorse] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mode, setMode] = useState<'heamatology' | 'chemistry' | 'both'>('both');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const res = await fetch('/api/horses');
        const data = await res.json();
        setHorses(data || []);
        if (data.length) setSelectedHorse(data[0]._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHorses();
  }, []);

  const handleExport = async (format: 'csv' | 'xlsx') => {
    if (!selectedHorse || !startDate || !endDate) {
      setFormError('Please select a horse and provide both start and end dates.');
      return;
    }

    const url = `/api/exportReports?format=${format}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ horseId: selectedHorse, startDate, endDate, mode }),
    });

    if (!res.ok) {
      const err = await res.json();      
      setFormError(err.error || 'Failed to export reports');
      return;
    } else {
      setFormError(null);
    } 

    const disposition = res.headers.get('Content-Disposition');
    let filename = `report_${startDate}_${endDate}.${format}`;
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename="?([^"]+)"?/);
      if (match?.[1]) filename = match[1];
    }

    const blob = await res.blob();
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = filename;
    a.click();
    a.remove();
    URL.revokeObjectURL(urlBlob);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Export Reports</h2>
      {formError && (
        <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
          {formError}
        </div>
      )}
      <div className="flex flex-col gap-4 max-w-md">
        <label>
          Horse:
          <select
            value={selectedHorse}
            onChange={(e) => setSelectedHorse(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {horses.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </label>

        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-medium">Mode:</span>
          <select
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as 'heamatology' | 'chemistry' | 'both')
            }
            className="border p-2 rounded w-full mt-1"
          >
            <option value="both">Both</option>
            <option value="heamatology">Haematology</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </label>

        <div className="flex gap-4 mt-2">
          <button
            onClick={() => handleExport('csv')}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex-1 cursor-pointer"
          >
            Export CSV
          </button>
          {/* <button
            onClick={() => handleExport('xlsx')}
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 flex-1 cursor-pointer"
          >
            Export Excel
          </button> */}
        </div>
      </div>
    </div>
  );
}
