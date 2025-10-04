'use client';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div>
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        borderBottom: "1px solid #eee"
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="/globe.svg" alt="Logo" style={{ height: 32, marginRight: 12 }} />
          <span style={{ fontWeight: "bold", fontSize: 20 }}>LabTest</span>
        </div>
        <div>
          <Link href="/" style={{ marginRight: 20 }}>Home</Link>
          <Link href="/upload" style={{ marginRight: 20 }}>Upload</Link>
          {!session ? (
            <>
              <Link href="/signin" style={{ marginRight: 20 }}>Sign In</Link>
              <Link href="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              <span style={{ marginRight: 20 }}>Welcome, {session.user.name}</span>
              <button onClick={() => signOut()}>Sign Out</button>
            </>
          )}
        </div>
      </nav>
      <main style={{ padding: "2rem" }}>
        <h1>Welcome to LabTest Reporting System</h1>
        <p>This is the index page of your Next.js app.</p>
      </main>
    </div>
  );
}
