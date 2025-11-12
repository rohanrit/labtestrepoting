'use client';
import React, { useEffect, useState } from "react";

type TestBasic = {
  _id?: string;
  testName: string;
  abbreviation: string;
  unit?: string;
  rangeLow?: string;
  rangeHigh?: string;
};

export default function TestBasicPage() {
  const [tests, setTests] = useState<TestBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch test reference data
  useEffect(() => {
    fetch("/api/test-basic/list")
      .then((res) => res.json())
      .then((data) => setTests(data))
      .finally(() => setLoading(false));
  }, []);

  // Handle input changes in a controlled way
  const handleChange = (
    index: number,
    field: keyof TestBasic,
    value: string
  ) => {
    const updatedTests = [...tests];
    updatedTests[index][field] = value;
    setTests(updatedTests);
  };

  // Update test entry
  const handleUpdate = async (test: TestBasic) => {
    if (!test._id) return;
    try {
      const res = await fetch("/api/test-basic/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(test),
      });
      if (!res.ok) throw new Error("Failed to update test");
      alert("Updated successfully!");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error updating test');
    }
  };

  // Delete test entry
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test?")) return;
    try {
      const res = await fetch("/api/test-basic/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      if (!res.ok) throw new Error("Failed to delete test");
      setTests(tests.filter((t) => t._id !== id));
      alert("Deleted successfully!");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error deleting test');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Manage Test Reference Data</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 gap-4">
        {tests.map((test, index) => (
          <form
            key={test._id}
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(test);
            }}
            className="p-4 bg-white border rounded-md grid grid-cols-1 md:grid-cols-6 gap-2 items-center"
          >
            <input
              type="text"
              value={test.testName}
              onChange={(e) => handleChange(index, "testName", e.target.value)}
              placeholder="Full Test Name"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              value={test.abbreviation}
              onChange={(e) =>
                handleChange(index, "abbreviation", e.target.value)
              }
              placeholder="Abbreviation"
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              value={test.unit || ""}
              onChange={(e) => handleChange(index, "unit", e.target.value)}
              placeholder="Unit"
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={test.rangeLow || ""}
              onChange={(e) =>
                handleChange(index, "rangeLow", e.target.value)
              }
              placeholder="Range Low"
              className="border p-2 rounded"
            />
            <input
              type="text"
              value={test.rangeHigh || ""}
              onChange={(e) =>
                handleChange(index, "rangeHigh", e.target.value)
              }
              placeholder="Range High"
              className="border p-2 rounded"
            />
            <div className="w-full flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => test._id && handleDelete(test._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                disabled
              >
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
