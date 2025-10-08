// src/components/PdfExtractor.tsx
'use client';

import { useState, FormEvent } from 'react';
import { extractText, getMeta, getDocumentProxy } from 'unpdf';

type MetaPayload = {
  info: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
};

function toPlainMetadata(md: unknown): Record<string, unknown> | null {
  if (!md) return null;

  if (
    typeof md === 'object' &&
    md !== null &&
    'getAll' in md &&
    typeof (md as { getAll: () => Iterable<[string, unknown]> }).getAll === 'function'
  ) {
    try {
      const entries = (md as { getAll: () => Iterable<[string, unknown]> }).getAll();
      return Object.fromEntries(entries);
    } catch {}
  }

  if (
    typeof md === 'object' &&
    md !== null &&
    '_metadata' in md &&
    typeof (md as { _metadata: Record<string, unknown> })._metadata === 'object'
  ) {
    return (md as { _metadata: Record<string, unknown> })._metadata;
  }

  return typeof md === 'object' && md !== null
    ? (md as Record<string, unknown>)
    : { value: String(md) };
}

export default function PdfExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [meta, setMeta] = useState<MetaPayload | null>(null);
  const [pages, setPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File): Promise<void> {
    setError(null);
    setText('');
    setMeta(null);
    setPages(null);
    setLoading(true);
    try {
      const ab = await file.arrayBuffer();
      const pdf = await getDocumentProxy(new Uint8Array(ab));
      const { totalPages, text } = await extractText(pdf, { mergePages: true });
      const { info, metadata } = await getMeta(pdf, { parseDates: true });

      setPages(totalPages ?? null);
      setText(text || '');
      setMeta({
        info: typeof info === 'object' && info !== null ? (info as Record<string, unknown>) : null,
        metadata: toPlainMetadata(metadata),
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (file) handleFile(file);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="border border-gray-300 rounded p-2"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        disabled={!file || loading}
      >
        {loading ? 'Parsing...' : 'Upload & Extract'}
      </button>

      {error && <p className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</p>}

      {pages !== null && (
        <div className="rounded border bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-2">Summary</h3>
          <p>Pages: {pages}</p>
        </div>
      )}

      {meta && (
        <div className="rounded border bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-2">Metadata</h3>
          {meta.info && (
            <pre className="overflow-auto rounded bg-gray-900 p-3 text-sm text-gray-100">
              {JSON.stringify(meta.info, null, 2)}
            </pre>
          )}
          {meta.metadata && (
            <pre className="overflow-auto rounded bg-gray-900 p-3 text-sm text-gray-100">
              {JSON.stringify(meta.metadata, null, 2)}
            </pre>
          )}
          {!meta.info && !meta.metadata && <p>No metadata found.</p>}
        </div>
      )}

      {text && (
        <div className="rounded border bg-white p-4 shadow-sm">
          <h3 className="text-lg font-medium mb-2">Extracted Text</h3>
          <pre className="whitespace-pre-wrap break-words text-sm">{text}</pre>
        </div>
      )}
    </form>
  );
}
