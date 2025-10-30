import React from 'react'
import PdfExtractorClient from '@/app/components/PdfExtractorClient';

const page = () => {
    return (
        <section className="bg-white shadow rounded-lg p-6">
            <PdfExtractorClient category="chemistry" sectitle="Upload Chemistry Reports" />
        </section>
    )
}

export default page