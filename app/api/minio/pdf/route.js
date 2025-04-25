import { Client } from 'minio'
// import config from '@/config'

// endPoint=localhost
// port=9000,
// useSSL=false,
// accessKey=Sd3iMXs3JZSytPV1GDiz
// secretKey=g4qIGjT1Bo8wvdQF9Dmn0ECUC3a2Vqk6noG9ZTDB

const minioClient = new Client({
  endPoint: 'localhost',  // e.g., 'localhost'
  port: 9000,  // e.g., 9000
  useSSL: false,
  accessKey: 'Sd3iMXs3JZSytPV1GDiz',
  secretKey: 'g4qIGjT1Bo8wvdQF9Dmn0ECUC3a2Vqk6noG9ZTDB',
})


export async function GET(req) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return new Response('Missing ID', { status: 400 })

  const bucket = 'newsletter-pdfs'
  const object = `${id}.pdf`

  try {
    const stream = await minioClient.getObject(bucket, object)
    console.log(stream);
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${object}"`,
      },
    })
  } catch (err) {
    console.error('Error fetching PDF:', err)
    return new Response('PDF not found', { status: 404 })
  }
}
