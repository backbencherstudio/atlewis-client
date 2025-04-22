import PdfTextExtractor from "@/components/ExtractPdf";


export default async function  PdfUrlPage({ params}) {
    const pdfUrl = (await params)?.pdf_url;

   try {
    const parsed = new URL(pdfUrl);

    // Check by extension first (optional shortcut)
    if (parsed.pathname.toLowerCase().endsWith('.pdf')){
        throw new Error('Invalid PDF URL');
    }

    // Fallback to HEAD request to check content type
    const response = await fetch(url, { method: 'HEAD' });
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
    
    return <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <PdfTextExtractor pdfUrl="/1.pdf" />
        <h1 className="text-2xl font-bold mb-4">My PDF Reader</h1>
        {/* <PdfViewer file="/book.pdf" /> */}
        <object className="pdf"
            data="/book.pdf"
            width="1000"
            height="700">
            <p>PDF cannot be displayed. Please download it <a href="/book.pdf">here</a>.</p>
        </object>

        {/* <Speak /> */}

    </main>;
}