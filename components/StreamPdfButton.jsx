// 'use client';

// import { useEffect, useState } from 'react';
// import NotFound from './NotFound';

// export default function StreamPdfButton({ fileName }) {
//   const [pdfUrl, setPdfUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFetchPdf = async () => {
//     setIsLoading(true);
//     setError('');
//     setPdfUrl('');

//     try {
//     //   const fileName = 'WAM232_1.pdf'; // Replace with your actual file name in your GCS bucket
//       const apiUrl = `/api/stream-pdf?fileName=${fileName}`;

//       console.log('API URL:', apiUrl);

//       // Fetch the PDF from the API route
//       const response = await fetch(apiUrl);

//       if (!response.ok) {
//         throw new Error('Failed to fetch PDF.');
//       }

//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);

//       setPdfUrl(url); // Set the URL for embedding the PDF
//     } catch (err) {
//       setError('Error loading the PDF.');
//       console.error('Error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Clean up the URL object when the component unmounts
//     handleFetchPdf();
//     // return () => {
//     //   if (pdfUrl) {
//     //     URL.revokeObjectURL(pdfUrl);
//     //   }
//     // };
//   }, []);

//   if (error) {
//     return <NotFound />
//   }

//   return (
//    <div className='flex items-center justify-center bg-gray-200'>
//      <div className="w-full max-w-5xl mt-10  px-5">
//       {isLoading && <div className="mt-4 text-blue-500 flex justify-center items-center h-screen">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="animate-spin h-12 w-12 text-blue-500"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//       >
//         <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-50" />
//         <path
//           d="M4 12a8 8 0 0 1 8-8"
//           strokeWidth="4"
//           className="opacity-75"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//       <p>Loading PDF...</p>
//     </div>}
//       {pdfUrl && (
//         <embed type="application/pdf"
//            className="w-full rounded-lg overflow-hidden aspect-video pb-5 sm-pb-0 h-[400px] sm:h-screen"
//           src={pdfUrl}
//           width="100%"
//           height="600px"
//           title="PDF Viewer"
//           frameBorder="0"
//         />
//       )}
//     </div>
//    </div>
//   );
// }



// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { getDocument, GlobalWorkerOptions} from 'pdfjs-dist/legacy/build/pdf.mjs';
// import NotFound from './NotFound';

// // set worker
// GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs`;

// export default function StreamPdfViewer({ fileName }) {
//   const canvasRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   const renderPdf = async (blob) => {
//     try {
//       const url = URL.createObjectURL(blob);
//       const pdf = await getDocument(url).promise;
//       const page = await pdf.getPage(1);

//       const canvas = canvasRef.current;
//       if (!canvas) return;

//       const context = canvas.getContext('2d');
//       const viewport = page.getViewport({ scale: 1.5 });

//       canvas.height = viewport.height;
//       canvas.width = viewport.width;

//       await page.render({
//         canvasContext: context,
//         viewport: viewport,
//       }).promise;

//       URL.revokeObjectURL(url); // Clean up blob URL
//       setIsLoading(false);
//     } catch (err) {
//       console.error('PDF rendering error:', err);
//       setError('Failed to load PDF.');
//       setIsLoading(false);
//     }
//   };

//   const fetchPdfBlob = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`/api/stream-pdf?fileName=${fileName}`);
//       if (!response.ok) throw new Error('Network error');
//       const blob = await response.blob();
//       console.log(blob);
      
//       await renderPdf(blob);
//       setIsLoading(false);
//     } catch (err) {
//       setError('Failed to fetch PDF.');
//       setIsLoading(false);
//     }finally{
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPdfBlob();
//   }, []);

//   if (error) return <NotFound />;

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//       {isLoading ? (
//         <p className="text-blue-600">Loading PDF...</p>
//       ) : (
//         <canvas ref={canvasRef} className="shadow-lg border rounded" />
//       )}
//     </div>
//   );
// }


// // components/PdfViewer.tsx
// 'use client';
// import { useEffect, useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// // Set PDF.js worker source
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs`;

// export default function PdfViewer({ fileName }) {
//   const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
//   const [numPages, setNumPages] = useState(0);

//   useEffect(() => { 
//     fetch(`/api/stream-pdf?fileName=${fileName}`)
//       .then((res) => {
//         console.log(res);
        
//         return res.blob()
//       })
//       .then((blob) => {
//         const blobUrl = URL.createObjectURL(blob);
//         console.log(blobUrl);
        
//         setPdfBlobUrl(blobUrl);
//       });
//   }, [fileName]);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   return (
//     <div className="flex justify-center items-center flex-col gap-4 p-4">
//       {pdfBlobUrl ? (
//         <Document
//           file={pdfBlobUrl}
//           onLoadSuccess={onDocumentLoadSuccess}
//           loading={<p>Loading PDF...</p>}
//           error={<p>Failed to load PDF.</p>}
//         >
//           {Array.from(new Array(numPages), (el, index) => (
//             <Page
//               key={`page_${index + 1}`}
//               pageNumber={index + 1}
//               width={800}
//               renderTextLayer={false}
//               renderAnnotationLayer={false}
//             />
//           ))}
//         </Document>
//       ) : (
//         <p>Loading PDF...</p>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import NotFound from './NotFound';

// export default function StreamPdfButton({ fileName }) {
//   const [pdfUrl, setPdfUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFetchPdf = async () => {
//     setIsLoading(true);
//     setError('');
//     setPdfUrl('');

//     try {
//     //   const fileName = 'WAM232_1.pdf'; // Replace with your actual file name in your GCS bucket
//       const apiUrl = `/api/stream-pdf?fileName=${fileName}`;

//       console.log('API URL:', apiUrl);

//       // Fetch the PDF from the API route
//       const response = await fetch(apiUrl);

//       if (!response.ok) {
//         throw new Error('Failed to fetch PDF.');
//       }

//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);

//       setPdfUrl(url); // Set the URL for embedding the PDF
//     } catch (err) {
//       setError('Error loading the PDF.');
//       console.error('Error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Clean up the URL object when the component unmounts
//     handleFetchPdf();
//     // return () => {
//     //   if (pdfUrl) {
//     //     URL.revokeObjectURL(pdfUrl);
//     //   }
//     // };
//   }, []);

//   if (error) {
//     return <NotFound />
//   }

//   return (
//    <div className='flex items-center justify-center bg-gray-200'>
//      <div className="w-full max-w-5xl mt-10  px-5">
//       {isLoading && <div className="mt-4 text-blue-500 flex justify-center items-center h-screen">
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         className="animate-spin h-12 w-12 text-blue-500"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//       >
//         <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-50" />
//         <path
//           d="M4 12a8 8 0 0 1 8-8"
//           strokeWidth="4"
//           className="opacity-75"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//       <p>Loading PDF...</p>
//     </div>}
//       {pdfUrl && (
//         <embed type="application/pdf"
//            className="w-full rounded-lg overflow-hidden aspect-video pb-5 sm-pb-0 h-[400px] sm:h-screen"
//           src={pdfUrl}
//           width="100%"
//           height="600px"
//           title="PDF Viewer"
//           frameBorder="0"
//         />
//       )}
//     </div>
//    </div>
//   );
// }


'use client';
import { useEffect, useState, useRef } from 'react';
import NotFound from './NotFound';

export default function PDFViewer({ fileName }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(() => {
    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      // Set initial scale based on screen width
      return window.innerWidth < 768 ? 0.5 : 1.5;
    }
    // Default fallback
    return 0.5;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');
  const viewerRef = useRef(null);
  const pdfScriptRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const loadPdfLib = async () => {
      try {
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.min.js';
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
            pdfScriptRef.current = script;
          });
          
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.worker.min.js';
        }
        await fetchAndRenderPdf();
      } catch (err) {
        console.error('Error loading PDF library:', err);
        setError('Failed to load PDF viewer');
      }
    };
    
    loadPdfLib();

    return () => {
      if (pdfScriptRef.current) {
        document.body.removeChild(pdfScriptRef.current);
      }
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [fileName]);

  const fetchAndRenderPdf = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/stream-pdf?fileName=${fileName}`);
      if (!response.ok) throw new Error('Failed to fetch PDF');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      
      const loadingTask = window.pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      await renderAllPages(pdf);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAllPages = async (pdf) => {
    if (!viewerRef.current) return;
    viewerRef.current.innerHTML = '';

    const containerDiv = document.createElement('div');
    containerDiv.className = 'pdf-container';
    containerDiv.style.width = 'fit-content';
    containerDiv.style.margin = '0 auto';

    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const wrapperDiv = document.createElement('div');
        wrapperDiv.style.marginBottom = '20px';
        wrapperDiv.style.width = 'fit-content';
        
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio || 1;
        
        canvas.id = `page-${i}`;
        canvas.dataset.pageNumber = i.toString();
        canvas.className = 'shadow-2xl rounded-3xl border-2 border-gray-200 bg-white transition-transform duration-200 hover:scale-[1.01]';
        
        canvas.width = viewport.width * pixelRatio;
        canvas.height = viewport.height * pixelRatio;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        
        const context = canvas.getContext('2d');
        context.scale(pixelRatio, pixelRatio);
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
          enableWebGL: true,
          renderInteractiveForms: true
        }).promise;

        wrapperDiv.appendChild(canvas);
        containerDiv.appendChild(wrapperDiv);
      } catch (error) {
        console.error(`Error rendering page ${i}:`, error);
      }
    }
    
    viewerRef.current.appendChild(containerDiv);
    setupIntersectionObserver();
  };

  const setupIntersectionObserver = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.dataset.pageNumber);
            setCurrentPage(pageNum);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
      }
    );

    const pages = viewerRef.current.querySelectorAll('canvas');
    pages.forEach(page => observerRef.current.observe(page));
  };

  useEffect(() => {
    if (pdfDoc) {
      renderAllPages(pdfDoc);
    }
  }, [scale, pdfDoc]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

  if (error) return <NotFound />;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center space-y-4 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="text-blue-900 font-semibold text-lg">Loading your document...</p>
          <p className="text-blue-600/75 text-sm">Please wait while we prepare your PDF</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full items-center justify-center p-4 md:p-10 bg-gray-300'>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 w-full max-w-5xl rounded-xl overflow-hidden">
        <nav className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200 sticky top-0 z-50">
          <div className="w-full px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="p-2 md:p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-xl disabled:opacity-50 transition-all duration-200 group"
                title="Zoom Out"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-xs md:text-sm font-semibold bg-gray-100 px-3 md:px-4 py-2 rounded-lg min-w-[60px] md:min-w-[80px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={scale >= 3.0}
                className="p-2 md:p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-xl disabled:opacity-50 transition-all duration-200 group"
                title="Zoom In"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-3 md:px-4 py-2 rounded-lg">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs md:text-sm font-medium text-blue-900">
                Page {currentPage} of {numPages}
              </span>
            </div>
          </div>
        </nav>
        <main className="pt-8 md:pt-10 px-4 md:px-6 pb-6 overflow-x-auto h-[calc(100vh-80px)]">
          <div ref={viewerRef} className="min-w-full " />
        </main>
      </div>
    </div>
  );
}




// 'use client';
// import { useEffect, useState, useRef } from 'react';
// import NotFound from './NotFound';

// export default function PDFViewer({ fileName }) {
//   const [pdfDoc, setPdfDoc] = useState(null);
//   const [numPages, setNumPages] = useState(0);
//   const [scale, setScale] = useState(() => {
//     // Check if window is defined (client-side)
//     if (typeof window !== 'undefined') {
//       // Set initial scale based on screen width
//       return window.innerWidth < 768 ? 0.5 : 1.5;
//     }
//     // Default fallback
//     return 0.5;
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [pdfBlobUrl, setPdfBlobUrl] = useState('');
//   const viewerRef = useRef(null);
//   const pdfScriptRef = useRef(null);
//   const observerRef = useRef(null);

//   useEffect(() => {
//     const loadPdfLib = async () => {
//       try {
//         if (!window.pdfjsLib) {
//           const script = document.createElement('script');
//           script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.min.js';
//           script.async = true;
          
//           await new Promise((resolve, reject) => {
//             script.onload = resolve;
//             script.onerror = reject;
//             document.body.appendChild(script);
//             pdfScriptRef.current = script;
//           });
          
//           window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.worker.min.js';
//         }
//         await fetchAndRenderPdf();
//       } catch (err) {
//         console.error('Error loading PDF library:', err);
//         setError('Failed to load PDF viewer');
//       }
//     };
    
//     loadPdfLib();

//     return () => {
//       if (pdfScriptRef.current) {
//         document.body.removeChild(pdfScriptRef.current);
//       }
//       if (pdfBlobUrl) {
//         URL.revokeObjectURL(pdfBlobUrl);
//       }
//     };
//   }, [fileName]);

//   const fetchAndRenderPdf = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(`/api/stream-pdf?fileName=${fileName}`);
//       if (!response.ok) throw new Error('Failed to fetch PDF');
//       const blob = await response.blob();
//       const url = URL.createObjectURL(blob);
//       setPdfBlobUrl(url);
      
//       const loadingTask = window.pdfjsLib.getDocument(url);
//       const pdf = await loadingTask.promise;
//       setPdfDoc(pdf);
//       setNumPages(pdf.numPages);
//       await renderAllPages(pdf);
//     } catch (err) {
//       console.error('Error:', err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderAllPages = async (pdf) => {
//     if (!viewerRef.current) return;
//     viewerRef.current.innerHTML = '';

//     const containerDiv = document.createElement('div');
//     containerDiv.className = 'pdf-container';
//     containerDiv.style.width = 'fit-content';
//     containerDiv.style.margin = '0 auto';

//     for (let i = 1; i <= pdf.numPages; i++) {
//       try {
//         const page = await pdf.getPage(i);
//         const viewport = page.getViewport({ scale });
        
//         const wrapperDiv = document.createElement('div');
//         wrapperDiv.style.marginBottom = '20px';
//         wrapperDiv.style.width = 'fit-content';
        
//         const canvas = document.createElement('canvas');
//         const pixelRatio = window.devicePixelRatio || 1;
        
//         canvas.id = `page-${i}`;
//         canvas.dataset.pageNumber = i.toString();
//         canvas.className = 'shadow-2xl rounded-3xl border-2 border-gray-200 bg-white transition-transform duration-200 hover:scale-[1.01]';
        
//         canvas.width = viewport.width * pixelRatio;
//         canvas.height = viewport.height * pixelRatio;
//         canvas.style.width = `${viewport.width}px`;
//         canvas.style.height = `${viewport.height}px`;
        
//         const context = canvas.getContext('2d');
//         context.scale(pixelRatio, pixelRatio);
        
//         await page.render({
//           canvasContext: context,
//           viewport: viewport,
//           enableWebGL: true,
//           renderInteractiveForms: true
//         }).promise;

//         wrapperDiv.appendChild(canvas);
//         containerDiv.appendChild(wrapperDiv);
//       } catch (error) {
//         console.error(`Error rendering page ${i}:`, error);
//       }
//     }
    
//     viewerRef.current.appendChild(containerDiv);
//     setupIntersectionObserver();
//   };

//   const setupIntersectionObserver = () => {
//     if (observerRef.current) {
//       observerRef.current.disconnect();
//     }

//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const pageNum = parseInt(entry.target.dataset.pageNumber);
//             setCurrentPage(pageNum);
//           }
//         });
//       },
//       {
//         root: null,
//         rootMargin: '0px',
//         threshold: 0.5
//       }
//     );

//     const pages = viewerRef.current.querySelectorAll('canvas');
//     pages.forEach(page => observerRef.current.observe(page));
//   };

//   useEffect(() => {
//     if (pdfDoc) {
//       renderAllPages(pdfDoc);
//     }
//   }, [scale, pdfDoc]);

//   const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0));
//   const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

//   if (error) return <NotFound />;
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
//         <div className="text-center space-y-4 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
//           <p className="text-blue-900 font-semibold text-lg">Loading your document...</p>
//           <p className="text-blue-600/75 text-sm">Please wait while we prepare your PDF</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className='flex w-full items-center justify-center p-4 md:p-10 bg-gray-300'>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 w-full max-w-5xl rounded-xl overflow-hidden">
//         <nav className="bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200 sticky top-0 z-50">
//           <div className="w-full px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
//             <div className="flex items-center space-x-2 md:space-x-4">
//               <button
//                 onClick={handleZoomOut}
//                 disabled={scale <= 0.5}
//                 className="p-2 md:p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-xl disabled:opacity-50 transition-all duration-200 group"
//                 title="Zoom Out"
//               >
//                 <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
//                 </svg>
//               </button>
//               <span className="text-xs md:text-sm font-semibold bg-gray-100 px-3 md:px-4 py-2 rounded-lg min-w-[60px] md:min-w-[80px] text-center">
//                 {Math.round(scale * 100)}%
//               </span>
//               <button
//                 onClick={handleZoomIn}
//                 disabled={scale >= 3.0}
//                 className="p-2 md:p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-xl disabled:opacity-50 transition-all duration-200 group"
//                 title="Zoom In"
//               >
//                 <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//               </button>
//             </div>
//             <div className="flex items-center space-x-2 bg-blue-50 px-3 md:px-4 py-2 rounded-lg">
//               <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//               <span className="text-xs md:text-sm font-medium text-blue-900">
//                 Page {currentPage} of {numPages}
//               </span>
//             </div>
//           </div>
//         </nav>
//         <main className="pt-8 md:pt-10 px-4 md:px-6 pb-6 overflow-x-auto h-[calc(100vh-80px)]">
//           <div ref={viewerRef} className="min-w-full " />
//         </main>
//       </div>
//     </div>
//   );
// }

