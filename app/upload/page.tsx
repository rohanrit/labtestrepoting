'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProgress('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    if (file.size > 45 * 1024 * 1024) {
      setError('File size must be less than 45MB');
      return;
    }

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    setLoading(true);
    setProgress('Uploading...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress('Upload successful!');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <Link href="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
        ← Back to Home
      </Link>
      <h1>Upload PDF</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setError('');
            }}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || !file}
          style={{ 
            width: '100%', 
            padding: '8px',
            opacity: loading ? 0.7 : 1 
          }}
        >
          {loading ? 'Uploading...' : 'Upload PDF'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {progress && <p style={{ color: 'green', marginTop: '1rem' }}>{progress}</p>}
      </form>
    </div>
  );
}
