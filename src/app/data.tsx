import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable.js';

export default function DataPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/records')
      .then(res => res.json())
      .then(res => setData(res.data || []));
  }, []);

  return (
    <main style={{ padding: '1rem' }}>
      <h1>All Horse Lab Records</h1>
      <a href="/api/csv" download="lab_records.csv">
        <button>Download CSV</button>
      </a>
      <DataTable data={data} />
    </main>
  );
}
