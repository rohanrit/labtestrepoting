import UploadForm from '../components/UploadForm.js';
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '1rem' }}>
      <h1>Horse Haematology Lab PDF Extractor</h1>
      <UploadForm />
      <p>
        <Link href="/data">View All Records</Link>
      </p>
    </main>
  );
}
