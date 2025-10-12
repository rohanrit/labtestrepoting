"use client";
import { useState } from "react";

export default function HorseForm() {
  const [form, setForm] = useState({ name: "", breed: "", age: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/horses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) setMessage("Horse added successfully!");
    else setMessage(data.error || "Error adding horse");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add Horse</h2>

      <input
        type="text"
        placeholder="Horse name"
        className="w-full border rounded p-2"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Breed (optional)"
        className="w-full border rounded p-2"
        value={form.breed}
        onChange={(e) => setForm({ ...form, breed: e.target.value })}
      />

      <input
        type="number"
        placeholder="Age (optional)"
        className="w-full border rounded p-2"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
      />

      <button
        disabled={loading}
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Add Horse"}
      </button>

      {message && <p className="text-sm text-gray-700">{message}</p>}
    </form>
  );
}
