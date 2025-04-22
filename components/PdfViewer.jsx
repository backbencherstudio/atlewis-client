// "use client";
// import * as PDFJS from "pdfjs-dist/legacy/build/pdf.mjs";
// import { useCallback, useRef, useState, useEffect } from "react";
// import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiRotateCw, FiDownload, FiGrid } from "react-icons/fi";

// PDFJS.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";

// export default function PdfViewer({ file: src }) {
//   // Refs
//   const viewerRef = useRef(null);
//   const pagesContainerRef = useRef(null);
//   const sidebarRef = useRef(null);
//   const thumbnailsRef = useRef([]);

//   // State
//   const [pdfDoc, setPdfDoc] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [scale, setScale] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [isScrolling, setIsScrolling] = useState(false);
//   const [presentationMode, setPresentationMode] = useState(false);

//   // Initialize PDF document
//   useEffect(() => {
//     setIsLoading(true);
//     setError(null);

//     const loadingTask = PDFJS.getDocument(src);
//     loadingTask.promise.then(
//       (pdf) => {
//         setPdfDoc(pdf);
//         setIsLoading(false);
//       },
//       (error) => {
//         console.error("PDF loading error:", error);
//         setError("Failed to load PDF document");
//         setIsLoading(false);
//       }
//     );

//     return () => {
//       loadingTask.destroy();
//     };
//   }, [src]);

//   // Render pages
//   useEffect(() => {
//     if (!pdfDoc || !pagesContainerRef.current) return;

//     pagesContainerRef.current.innerHTML = '';
//     thumbnailsRef.current = [];

//     const renderPages = async () => {
//       for (let i = 1; i <= pdfDoc.numPages; i++) {
//         const page = await pdfDoc.getPage(i);
//         const viewport = page.getViewport({ scale: scale * window.devicePixelRatio, rotation });

//         // Create page container
//         const pageDiv = document.createElement('div');
//         pageDiv.className = 'pdf-page';
//         pageDiv.dataset.page = i;
//         pageDiv.style.height = `${viewport.height / window.devicePixelRatio}px`;
//         pageDiv.style.width = `${viewport.width / window.devicePixelRatio}px`;

//         // Create canvas
//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');
//         canvas.height = viewport.height;
//         canvas.width = viewport.width;

//         // Render page
//         await page.render({
//           canvasContext: context,
//           viewport: viewport
//         }).promise;

//         pageDiv.appendChild(canvas);
//         pagesContainerRef.current.appendChild(pageDiv);
//         thumbnailsRef.current[i] = { canvas, pageNum: i };
//       }
//     };

//     renderPages();
//   }, [pdfDoc, scale, rotation]);

//   // Handle scroll events
//   useEffect(() => {
//     const container = viewerRef.current;
//     if (!container) return;

//     const handleScroll = () => {
//       if (isScrolling) return;

//       const { scrollTop, scrollHeight, clientHeight } = container;
//       const scrollPosition = scrollTop / (scrollHeight - clientHeight);
//       const pageNum = Math.min(
//         pdfDoc?.numPages || 1,
//         Math.max(1, Math.round(scrollPosition * (pdfDoc?.numPages || 1) + 1)
//       ));

//       if (pageNum !== currentPage) {
//         setCurrentPage(pageNum);
//       }
//     };

//     container.addEventListener('scroll', handleScroll);
//     return () => container.removeEventListener('scroll', handleScroll);
//   }, [currentPage, isScrolling, pdfDoc]);

//   // Scroll to page
//   const scrollToPage = useCallback((pageNum) => {
//     if (!pdfDoc || !viewerRef.current) return;

//     const pageElement = pagesContainerRef.current.querySelector(`[data-page="${pageNum}"]`);
//     if (pageElement) {
//       setIsScrolling(true);
//       pageElement.scrollIntoView({ behavior: 'smooth' });
//       setTimeout(() => setIsScrolling(false), 500);
//     }
//   }, [pdfDoc]);

//   // Navigation controls
//   const nextPage = () => {
//     if (currentPage < (pdfDoc?.numPages || 1)) {
//       scrollToPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       scrollToPage(currentPage - 1);
//     }
//   };

//   const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
//   const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
//   const rotate = () => setRotation(prev => (prev + 90) % 360);
//   const toggleSidebar = () => setShowSidebar(prev => !prev);
//   const togglePresentationMode = () => setPresentationMode(prev => !prev);

//   const handlePageInput = (e) => {
//     const value = parseInt(e.target.value);
//     if (!isNaN(value) && value >= 1 && value <= (pdfDoc?.numPages || 1)) {
//       scrollToPage(value);
//     }
//   };

//   // Thumbnail click handler
//   const handleThumbnailClick = (pageNum) => {
//     scrollToPage(pageNum);
//     setShowSidebar(false);
//   };

//   return (
//     <div className={`pdf-viewer ${presentationMode ? 'presentation-mode' : ''}`}>
//       {/* Toolbar */}
//       <div className="toolbar">
//         <div className="toolbar-group">
//           <button onClick={toggleSidebar} className="toolbar-button" title="Thumbnails">
//             <FiGrid />
//           </button>
//           <button 
//             onClick={prevPage} 
//             disabled={currentPage <= 1}
//             className="toolbar-button" 
//             title="Previous page"
//           >
//             <FiChevronLeft />
//           </button>
//           <div className="page-controls">
//             <input
//               type="number"
//               min="1"
//               max={pdfDoc?.numPages || 1}
//               value={currentPage}
//               onChange={handlePageInput}
//               disabled={!pdfDoc}
//             />
//             <span> / {pdfDoc?.numPages || '--'}</span>
//           </div>
//           <button 
//             onClick={nextPage} 
//             disabled={currentPage >= (pdfDoc?.numPages || 1)}
//             className="toolbar-button"
//             title="Next page"
//           >
//             <FiChevronRight />
//           </button>
//         </div>

//         <div className="toolbar-group">
//           <button onClick={zoomOut} disabled={scale <= 0.5} className="toolbar-button" title="Zoom out">
//             <FiZoomOut />
//           </button>
//           <span className="zoom-level">{Math.round(scale * 100)}%</span>
//           <button onClick={zoomIn} disabled={scale >= 3} className="toolbar-button" title="Zoom in">
//             <FiZoomIn />
//           </button>
//         </div>

//         <div className="toolbar-group">
//           <button onClick={rotate} className="toolbar-button" title="Rotate">
//             <FiRotateCw />
//           </button>
//           <button onClick={togglePresentationMode} className="toolbar-button" title="Presentation mode">
//             {presentationMode ? 'Exit Fullscreen' : 'Fullscreen'}
//           </button>
//           <button onClick={() => window.open(src, '_blank')} className="toolbar-button" title="Download">
//             <FiDownload />
//           </button>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="viewer-container">
//         {/* Thumbnail sidebar */}
//         {showSidebar && (
//           <div className="sidebar" ref={sidebarRef}>
//             <div className="thumbnails">
//               {Array.from({ length: pdfDoc?.numPages || 0 }).map((_, i) => (
//                 <div 
//                   key={i+1}
//                   className={`thumbnail ${currentPage === i+1 ? 'active' : ''}`}
//                   onClick={() => handleThumbnailClick(i+1)}
//                 >
//                   <canvas ref={el => thumbnailsRef.current[i+1] = el} />
//                   <span>{i+1}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Document pages */}
//         <div className="document-viewer" ref={viewerRef}>
//           {isLoading && (
//             <div className="loading">
//               <div className="spinner"></div>
//               <p>Loading document...</p>
//             </div>
//           )}
          
//           {error && (
//             <div className="error">
//               <p>{error}</p>
//               <button onClick={() => window.location.reload()}>Retry</button>
//             </div>
//           )}
          
//           <div className="pages" ref={pagesContainerRef}>
//             {/* Pages are rendered here dynamically */}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
 
//         .pdf-viewer {
//           display: flex;
//           flex-direction: column;
//           height: 100vh;
//           background-color: #3c4043;
//           color: white;
//         }

//         .presentation-mode {
//           background-color: black;
//         }
//         .presentation-mode .toolbar {
//           display: none;
//         }
//         .presentation-mode .sidebar {
//           display: none;
//         }

//         .toolbar {
//           display: flex;
//           justify-content: space-between;
//           padding: 8px 16px;
//           background-color: #2d2d2d;
//           border-bottom: 1px solid #5f6368;
//         }

//         .toolbar-group {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .toolbar-button {
//           background: none;
//           border: none;
//           color: white;
//           padding: 8px;
//           border-radius: 4px;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .toolbar-button:hover {
//           background-color: #5f6368;
//         }

//         .toolbar-button:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         .page-controls {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//         }

//         .page-controls input {
//           width: 50px;
//           padding: 4px;
//           text-align: center;
//           border: 1px solid #5f6368;
//           border-radius: 4px;
//           background-color: #3c4043;
//           color: white;
//         }

//         .zoom-level {
//           min-width: 40px;
//           text-align: center;
//         }

//         .viewer-container {
//           display: flex;
//           flex: 1;
//           overflow: hidden;
//         }

//         .sidebar {
//           width: 200px;
//           background-color: #2d2d2d;
//           border-right: 1px solid #5f6368;
//           overflow-y: auto;
//         }

//         .thumbnails {
//           padding: 8px;
//           display: grid;
//           gap: 8px;
//         }

//         .thumbnail {
//           position: relative;
//           cursor: pointer;
//           border-radius: 4px;
//           overflow: hidden;
//           background-color: #3c4043;
//         }

//         .thumbnail:hover {
//           box-shadow: 0 0 0 2px #8ab4f8;
//         }

//         .thumbnail.active {
//           box-shadow: 0 0 0 2px #8ab4f8;
//         }

//         .thumbnail canvas {
//           width: 100%;
//           height: auto;
//           display: block;
//         }

//         .thumbnail span {
//           position: absolute;
//           bottom: 4px;
//           right: 4px;
//           background-color: rgba(0, 0, 0, 0.7);
//           color: white;
//           padding: 2px 6px;
//           border-radius: 4px;
//           font-size: 12px;
//         }

//         .document-viewer {
//           flex: 1;
//           overflow: auto;
//           position: relative;
//           background-color: #525659;
//         }

//         .pages {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 20px;
//           padding: 20px;
//         }

//         .pdf-page {
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
//           background-color: white;
//         }

//         .loading, .error {
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           background-color: rgba(0, 0, 0, 0.7);
//         }

//         .spinner {
//           border: 4px solid rgba(255, 255, 255, 0.3);
//           border-radius: 50%;
//           border-top: 4px solid white;
//           width: 40px;
//           height: 40px;
//           animation: spin 1s linear infinite;
//           margin-bottom: 16px;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }

'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";

export default function PdfViewer({ pdfUrl = '/book.pdf' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [thumbnails, setThumbnails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise.then(
      (loadedPdf) => {
        if (!isMounted) return;
        setPdf(loadedPdf);
        setTotalPages(loadedPdf.numPages);
        generateThumbnails(loadedPdf);
        setIsLoading(false);
      },
      (err) => {
        console.error("PDF loading error:", err);
        if (!isMounted) return;
        setError("Failed to load PDF document");
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      loadingTask.destroy();
    };
  }, [pdfUrl]);

  const renderPage = useCallback((num, customScale = scale) => {
    if (!pdf || !containerRef.current) return;

    pdf.getPage(num).then((page) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const container = containerRef.current;

      const containerWidth = container.clientWidth - 40;
      const viewport = page.getViewport({ scale: 1 });
      const scaleRatio = containerWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale: scaleRatio * customScale });

      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      return page.render({ canvasContext: context, viewport: scaledViewport }).promise;
    }).catch(err => {
      console.error("Page render error:", err);
      setError("Failed to render page");
    });
  }, [pdf, scale]);

  const generateThumbnails = async (loadedPdf) => {
    const thumbs = [];
    const promises = [];

    const pagesToRender = Math.min(10, loadedPdf.numPages);
    for (let i = 1; i <= pagesToRender; i++) {
      promises.push(
        loadedPdf.getPage(i).then(page => {
          const viewport = page.getViewport({ scale: 0.15 });
          const tempCanvas = document.createElement('canvas');
          const context = tempCanvas.getContext('2d');
          tempCanvas.height = viewport.height;
          tempCanvas.width = viewport.width;

          return page.render({ canvasContext: context, viewport }).promise.then(() => ({
            pageNum: i,
            dataUrl: tempCanvas.toDataURL()
          }));
        }).catch(err => {
          console.error(`Error generating thumbnail for page ${i}:`, err);
          return null;
        })
      );
    }

    for (let i = pagesToRender + 1; i <= loadedPdf.numPages; i++) {
      promises.push(
        new Promise(resolve => {
          setTimeout(() => {
            loadedPdf.getPage(i).then(page => {
              const viewport = page.getViewport({ scale: 0.15 });
              const tempCanvas = document.createElement('canvas');
              const context = tempCanvas.getContext('2d');
              tempCanvas.height = viewport.height;
              tempCanvas.width = viewport.width;

              return page.render({ canvasContext: context, viewport }).promise.then(() => ({
                pageNum: i,
                dataUrl: tempCanvas.toDataURL()
              }));
            }).then(resolve).catch(err => {
              console.error(`Error generating thumbnail for page ${i}:`, err);
              resolve(null);
            });
          }, 0);
        })
      );
    }

    const results = await Promise.all(promises);
    setThumbnails(results.filter(r => r !== null).sort((a, b) => a.pageNum - b.pageNum).map(r => r.dataUrl));
  };

  const handlePageChange = useCallback((num) => {
    if (num < 1 || num > totalPages) return;
    setPageNum(num);
  }, [totalPages]);

  const nextPage = useCallback(() => handlePageChange(pageNum + 1), [pageNum, handlePageChange]);
  const prevPage = useCallback(() => handlePageChange(pageNum - 1), [pageNum, handlePageChange]);

  const zoomIn = useCallback(() => {
    const newScale = Math.min(scale + 0.2, 3);
    setScale(newScale);
  }, [scale]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(scale - 0.2, 0.5);
    setScale(newScale);
  }, [scale]);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowRight': nextPage(); break;
      case 'ArrowLeft': prevPage(); break;
      case '+': zoomIn(); break;
      case '-': zoomOut(); break;
      default: return;
    }
    e.preventDefault();
  }, [nextPage, prevPage, zoomIn, zoomOut]);

  useEffect(() => {
    if (pdf) renderPage(pageNum);
  }, [pdf, pageNum, scale, renderPage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-48 bg-white border-r border-gray-200 overflow-y-auto p-2 shadow-sm">
        <div className="sticky top-0 bg-white py-2 border-b border-gray-200">
          <h2 className="font-medium text-gray-700 px-2">Pages</h2>
        </div>
        <div className="space-y-2 mt-2">
          {thumbnails.map((thumb, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`w-full p-1 rounded-md transition-all ${pageNum === index + 1 ? 
                'ring-2 ring-blue-500 bg-blue-50' : 
                'hover:bg-gray-100'}`}
            >
              <img src={thumb} alt={`Page ${index + 1}`} className="w-full h-auto rounded shadow-sm" />
              <p className="text-xs text-center mt-1 text-gray-600">Page {index + 1}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <button onClick={prevPage} disabled={pageNum <= 1} className={`p-2 rounded-md ${pageNum <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <span className="text-sm font-medium text-gray-700">
              Page <input type="number" min="1" max={totalPages} value={pageNum} onChange={(e) => handlePageChange(Number(e.target.value))} className="w-12 text-center border border-gray-300 rounded-md px-2 py-1 mx-1" /> of {totalPages}
            </span>

            <button onClick={nextPage} disabled={pageNum >= totalPages} className={`p-2 rounded-md ${pageNum >= totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={zoomOut} disabled={scale <= 0.5} className={`p-2 rounded-md ${scale <= 0.5 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-sm font-medium text-gray-700">{Math.round(scale * 100)}%</span>
            <button onClick={zoomIn} disabled={scale >= 3} className={`p-2 rounded-md ${scale >= 3 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <a href={pdfUrl} download className="p-2 text-gray-700 hover:bg-gray-100 rounded-md" title="Download PDF">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <div ref={containerRef} className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-700">Loading document...</p>
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
              <div className="text-red-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading PDF</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
                Reload
              </button>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-md overflow-hidden">
              <canvas ref={canvasRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
