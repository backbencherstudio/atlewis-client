'use client';

import { use, useEffect, useState } from 'react';
import PdfReader from './PdfReader';

export default function PostPdfComponent({fileName}) {
//   const [pdfUrl, setPdfUrl] = useState('https://storage.googleapis.com/wadshs/WAM232_1.pdf'); // Default PDF URL
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePostPdf = async () => {
    setIsLoading(true);
    setError('');
    setResponse(null);

    try {
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/parse-pdf`;
      const res = await fetch(API_URL, {
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json', // Send JSON
        },
        body: JSON.stringify({ url: `https://storage.googleapis.com/wadshs/${fileName}` }), // Send the URL as JSON body
      });

      if (res.ok) {
        const data = await res.json(); // Assuming the server responds with JSON data
        setResponse(data); // Store the response in the state
      } else {
        setError('Failed to parse the PDF.'); // Error handling
      }
    } catch (err) {
      setError('Error sending request: ' + err.message); // Catch any errors
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
     handlePostPdf();
    // Clean up the URL object when the component unmounts
    // if (pdfUrl) {
    //   URL.revokeObjectURL(pdfUrl);
    // }
  }, []);

  if(error){
    return null
  }
  return (
    <div className="mx-auto">
      
      {
        response && <PdfReader text={response?.content} onReady={() => console.log('it is working')}  />
      }
    </div>
  );
}
