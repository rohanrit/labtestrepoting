'use client';

import { useState, FormEvent } from 'react';
import { extractText, getDocumentProxy } from 'unpdf';

export type MetaPayload = {
  info: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
};

type Props = {
  onExtract?: (payload: { text: string; meta: MetaPayload | null }) => void;
  sectitle?: string;
};


export default function PdfExtractor({ onExtract, sectitle, }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    setLoading(true);
    try {
      const ab = await file.arrayBuffer();
      const pdf = await getDocumentProxy(new Uint8Array(ab));
      const { text } = await extractText(pdf, { mergePages: true });

      const info: Record<string, unknown> | null = null;
      const metadata: Record<string, unknown> | null = null;

      onExtract?.({ text, meta: { info, metadata } });
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to parse PDF';
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF');
      return;
    }
    handleFile(file);
  }

  return (
    <>
      {sectitle && (
        <h2 className="text-xl font-semibold mb-4 text-center">{sectitle}</h2>
      )}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">

        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
          <p className="text-gray-600 mb-2">Drag & drop your PDF file here</p>
          <p className="text-sm text-gray-400">or</p>
          <label className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700">
            Browse File
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </label>
          {file && (
            <p className="mt-3 text-sm text-green-700 font-medium">
              Selected file: {file.name}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || loading}
          className={`w-full py-2 rounded text-white transition ${!file || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {loading ? 'Extracting...' : 'Extract PDF'}
        </button>
      </form>
    </>


  );
}
