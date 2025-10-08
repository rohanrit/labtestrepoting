// src/components/PdfExtractorClient.tsx
'use client';

import dynamic from 'next/dynamic';

const PdfExtractor = dynamic(() => import('./PdfExtractor'), {
  ssr: false,
});

export default PdfExtractor;
