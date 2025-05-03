// 'use client';
 // Adjust the import path as needed
import StreamPdfButton from '@/components/StreamPdfButton';
import PostPdfComponent from '@/components/PostPdfComponent';
import NotFound from '@/components/NotFound';
import PdfReader from '@/components/PdfReader';


export default async function NewsletterPage({ searchParams  }) {
//   const { query } = useRouter();
//   const fileName = query.pdf;
    const {pdf: fileName} = await searchParams;
    
    

    if (!fileName) {
      return <NotFound />;
    }

  return (
    <>
        <PostPdfComponent fileName={fileName} />
        <StreamPdfButton fileName={fileName} />
        {/* <PdfReader  onReady={()=>{}}/> */}
        <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Washington State Department of Social and Health Services. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
