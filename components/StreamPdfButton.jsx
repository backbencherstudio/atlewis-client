'use client';

import { useEffect, useState } from 'react';
import NotFound from './NotFound';

export default function StreamPdfButton({ fileName }) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetchPdf = async () => {
    setIsLoading(true);
    setError('');
    setPdfUrl('');

    try {
    //   const fileName = 'WAM232_1.pdf'; // Replace with your actual file name in your GCS bucket
      const apiUrl = `/api/stream-pdf?fileName=${fileName}`;

      console.log('API URL:', apiUrl);

      // Fetch the PDF from the API route
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch PDF.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setPdfUrl(url); // Set the URL for embedding the PDF
    } catch (err) {
      setError('Error loading the PDF.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Clean up the URL object when the component unmounts
    handleFetchPdf();
    // return () => {
    //   if (pdfUrl) {
    //     URL.revokeObjectURL(pdfUrl);
    //   }
    // };
  }, []);

  if (error) {
    return <NotFound />
  }

  return (
   <div className='flex items-center justify-center bg-gray-200'>
     <div className="w-full max-w-5xl mt-10  px-5">
      {isLoading && <div className="mt-4 text-blue-500 flex justify-center items-center h-screen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin h-12 w-12 text-blue-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-50" />
        <path
          d="M4 12a8 8 0 0 1 8-8"
          strokeWidth="4"
          className="opacity-75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p>Loading PDF...</p>
    </div>}
      {pdfUrl && (
        <embed type="application/pdf"
           className="w-full rounded-lg overflow-hidden aspect-video pb-5 sm-pb-0 h-[400px] sm:h-screen"
          src={pdfUrl}
          width="100%"
          height="600px"
          title="PDF Viewer"
          frameBorder="0"
        />
      )}
    </div>
   </div>
  );
}
