// 'use client';
 // Adjust the import path as needed
import StreamPdfButton from '@/components/StreamPdfButton';
import PostPdfComponent from '@/components/PostPdfComponent';
import NotFound from '@/components/NotFound';


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
    </>
  );
}
