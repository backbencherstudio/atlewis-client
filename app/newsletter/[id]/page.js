'use client';

// import PdfTextExtractor from '@/components/PdfTextExtractor'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PdfTextExtractor from '@/components/ExtractPdf';

export default function NewsletterPage() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [textReady, setTextReady] = useState(false)
  const { id } = useParams();
  

  useEffect(() => {
    if (id) {
      const securePdfPath = `/api/minio/pdf?id=${id}`;
      setPdfUrl(securePdfPath);
      setTextReady(false) // Reset on id change
    }
  }, [id]);

  return (
    <main className="flex max-h-screen flex-col items-center justify-start">
      {pdfUrl ? (
        // <PdfTextExtractor pdfUrl={pdfUrl} />
        <>
          {/* PDF preview */}
          <PdfTextExtractor pdfUrl={pdfUrl}  onReady={() => setTextReady(true)} />
          {textReady && (<div className="w-full max-w-5xl mt-6 mb-10 px-5">
            <object
              className="w-full rounded-lg aspect-video pb-5 sm-pb-0 h-[400px] sm:h-screen"
              data={pdfUrl}
              type="application/pdf"
            >
              {/* <p className="text-white text-center mt-4">
                PDF cannot be displayed. Please download it{' '}
                <a href={pdfUrl} download className="underline text-blue-300">
                  here
                </a>
                .
              </p> */}
            </object>
          </div>)}
        </>
      ) : (
       // i need great loading animation here
       <div className="flex items-center justify-center h-screen w-full bg-[#004AAD] text-white transition-all duration-300 ease-in-out">
       <div className="flex flex-col items-center space-y-4">
         <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent" />
         <p className="text-xl font-semibold">Loading your newsletter...</p>
       </div>
     </div>
      )}
    </main>
  );
}
