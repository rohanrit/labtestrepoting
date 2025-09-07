export default function DownloadJsonButton({ data }) {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'hematology_results.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return <button onClick={handleDownload}>Download JSON</button>;
}
