export default function DownloadJsonButton({ data }) {
  const download = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hematology_results.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return <button onClick={download}>Download JSON</button>;
}
