import { useState } from 'react';
import DownloadJsonButton from './DownloadJsonButton.js';

export default function UploadForm() {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onFileChange(e) {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    const res = await fetch('/api/extract', {
      method: 'POST',
      body: await file.arrayBuffer()
    });
    const json = await res.json();
    setJsonData(json.data || null);
    setLoading(false);
  }

  return (
    <div>
      <label>
        Upload Horse Lab PDF:
        <input type="file" accept="application/pdf" onChange={onFileChange} />
      </label>
      {loading && <p>Processing...</p>}
      {jsonData && (
        <>
          <h3>Extracted JSON</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(jsonData, null, 2)}</pre>
          <DownloadJsonButton data={jsonData} />
        </>
      )}
    </div>
  );
}
