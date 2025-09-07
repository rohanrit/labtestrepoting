import { useState } from 'react';
import DownloadJsonButton from './DownloadJsonButton';

export default function UploadForm() {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    const res = await fetch('/api/extract', {
      method: 'POST',
      headers: {},
      body: await file.arrayBuffer(),
    });
    const { json } = await res.json();
    setJsonData(json);
    setLoading(false);
  };

  return (
    <div>
      <label>
        Upload Horse Lab PDF:
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
      </label>
      {loading && <div>Processing...</div>}
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
