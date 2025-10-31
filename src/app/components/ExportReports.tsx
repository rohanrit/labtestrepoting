'use client';

import { useEffect, useState } from 'react';

type Horse = { _id: string; name: string; };

export default function ExportReports() {
  const [horses, setHorses] = useState<Horse[]>([]);
  const [selectedHorse, setSelectedHorse] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mode, setMode] = useState<'heamatology' | 'chemistry'>('heamatology');

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

  const handleExport = async () => {
    if (!selectedHorse || !startDate || !endDate) {
      alert('Please select a horse and provide both start and end dates.');
      return;
    }

    const res = await fetch('/api/exportReports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ horseId: selectedHorse, startDate, endDate, mode }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Failed to export reports');
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode}_${selectedHorse}_${startDate}_${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Export Reports</h2>

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

        <label>
          Mode:
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'heamatology' | 'chemistry')}
            className="border p-2 rounded w-full"
          >
            <option value="heamatology">Haematology</option>
            <option value="chemistry">Chemistry</option>
          </select>
        </label>

        <button
          onClick={handleExport}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
