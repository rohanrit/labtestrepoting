import Navbar from './components/Navbar';

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "2rem" }}>
        <h1>Welcome to LabTest Reporting System</h1>
        <p>This is the index page of your Next.js app.</p>
      </main>
    </div>
  );
}
