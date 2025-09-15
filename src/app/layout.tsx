// src/app/layout.tsx
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Horse Hematology Lab Extractor',
  description: 'Extract and process horse hematology lab PDFs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* You can add more metadata tags here */}
      </head>
      <body>
        <header style={{ padding: 20, backgroundColor: '#0070f3', color: 'white' }}>
          <h1>Horse Hematology Lab Data Extraction</h1>
        </header>
        <main style={{ padding: '20px' }}>
          {children}
        </main>
        <footer style={{ padding: 20, textAlign: 'center', borderTop: '1px solid #ccc' }}>
          &copy; {new Date().getFullYear()} Horse Lab Extractor
        </footer>
      </body>
    </html>
  );
}
