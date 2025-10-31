'use client';

import { useEffect, useState } from 'react';

export default function HorsesPage() {
  const [horses, setHorses] = useState<{ _id: string; name: string }[]>([]);
  const [newHorse, setNewHorse] = useState('');

  useEffect(() => {
    fetch('/api/horses')
      .then(res => res.json())
      .then(data => setHorses(data));
  }, []);

  const addHorse = async () => {
    if (!newHorse.trim()) return;
    const res = await fetch('/api/horses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newHorse }),
    });
    const added = await res.json();
    setHorses(prev => [...prev, added]);
    setNewHorse('');
  };

  const removeHorse = async (id: string) => {
    await fetch('/api/horses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setHorses(prev => prev.filter(h => h._id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Horses</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newHorse}
          onChange={e => setNewHorse(e.target.value)}
          placeholder="Enter horse name"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={addHorse}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {horses.map(horse => (
          <li key={horse._id} className="flex justify-between items-center border border-gray-300 bg-gray-100 p-3 rounded">
            <span>{horse.name}</span>
            <button
              onClick={() => removeHorse(horse._id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
