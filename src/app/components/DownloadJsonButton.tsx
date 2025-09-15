import React from "react";

interface DownloadJsonButtonProps {
  data: object | object[];
  filename?: string;
}

const DownloadJsonButton: React.FC<DownloadJsonButtonProps> = ({
  data,
  filename = "data.json",
}) => {
  const handleDownload = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} style={{ marginTop: "1rem" }}>
      Download JSON
    </button>
  );
};

export default DownloadJsonButton;
