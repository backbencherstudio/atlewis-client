// 'use client';
import PdfTextExtractor from "@/components/ExtractPdf";
import Speak from "@/components/Speak";
// import PdfParse from "pdf-parse";

export default async function Home({ searchParams}) {
  const query = await searchParams;
  const pdf = query["pdf"];

  console.log(pdf);
  

  // const pdfUrl = "book.pdf";
  // const pdfData = fetch(pdfUrl)
  //   .then((response) => response.arrayBuffer())
  //   .then((data) => PdfParse(data))
  //   .then((pdf) => {
  //     console.log(pdf);
  //     return pdf.text;
  //   })
  //   .then((text) => {
  //     console.log(text);
  //     // Do something with the text
  //   }
  //   )
  //   .catch((error) => {
  //     console.error("Error fetching PDF:", error);
  //   });

  if(!pdf){
    return <div className="flex items-center justify-center h-screen bg-gray-50">
  <div className="flex flex-col items-center gap-4 bg-white border-2 border-gray-300 rounded-xl shadow-lg p-10">
    <svg className="w-14 h-14 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm-1.5 4.5h.008v.008h-.008V14.25zm0-6.75a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15z" />
    </svg>
    <h1 className="text-3xl font-bold text-gray-800">404 - Page Not Found</h1>
    <p className="text-gray-600 text-center max-w-md">
      Sorry, the page you’re looking for doesn’t exist or has been moved.
    </p>
    {/* <a href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
      Go Home
    </a> */}
  </div>
</div>
  }


  try {
    const parsed = new URL(pdf);
    console.log("Parse url: ", parsed.pathname, parsed.pathname.toLowerCase().endsWith('.pdf'));
    // Check by extension first (optional shortcut)
    if (!(parsed.pathname.toLowerCase().endsWith('.pdf'))){
        throw new Error('Invalid PDF URL');
    }

    // // Fallback to HEAD request to check content type
    const response = await fetch(pdf, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    
     if(contentType !== 'application/pdf'){
        throw new Error('Invalid PDF URL');
     }

    
   }catch (error) {
        return <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="flex items-center gap-4 bg-white border-2 border-red-300 rounded-xl shadow-lg p-8">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 18.93A10 10 0 1 1 18.93 5.07 10 10 0 0 1 5.07 18.93z" />
          </svg>
          <h1 className="text-2xl font-semibold text-red-700">Invalid PDF URL</h1>
        </div>
      </div>
      ;
   }

  



  return (
    
    <main className="flex max-h-screen flex-col items-center justify-center mx-auto">
      <PdfTextExtractor pdfUrl={pdf} />
    {/* <h1 className="text-2xl font-bold mb-4">My PDF Reader</h1> */}
    {/* <PdfViewer file="/book.pdf" /> */}
    <object className="pdf mt-5 rounded-lg h-[93vh] mb-10" 
            data={pdf}
            width="1000"
            height="700">
      <p>PDF cannot be displayed. Please download it <a href={pdf} download>here</a>.</p>
    </object>
    {/* <Speak /> */}
  </main>
  );
}
