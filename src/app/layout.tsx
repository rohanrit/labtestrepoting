// src/app/layout.tsx
import './globals.css';
import React from 'react';

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE,
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
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
          <h1>Horse Haematology Lab Data Extraction</h1>
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
