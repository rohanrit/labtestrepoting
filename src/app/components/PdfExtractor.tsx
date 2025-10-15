'use client';

import { useState, FormEvent } from 'react';
import { extractText, getDocumentProxy } from 'unpdf';

export type MetaPayload = {
  info: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
};

type Props = {
  onExtract?: (payload: { text: string; meta: MetaPayload | null }) => void;
};

export default function PdfExtractor({ onExtract }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    setLoading(true);
    try {
      const ab = await file.arrayBuffer();
      const pdf = await getDocumentProxy(new Uint8Array(ab));
      const { text } = await extractText(pdf, { mergePages: true });

      let info: Record<string, unknown> | null = null;
      let metadata: Record<string, unknown> | null = null;

      if (typeof pdf.getMetadata === 'function') {
        const meta = await pdf.getMetadata();
        info = meta?.info ?? null;
        metadata = meta?.metadata ?? null;
      }

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
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        type="submit"
        disabled={!file || loading}
        className="bg-blue-600 text-white p-2 rounded"
      >
        {loading ? 'Extracting...' : 'Extract PDF'}
      </button>
    </form>
  );
}
