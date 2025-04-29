// import { NextResponse } from 'next/server'
// import { Storage } from '@google-cloud/storage'

// const storage = new Storage({
//   projectId: process.env.GCP_PROJECT_ID,
//   keyFilename: process.env.GCP_KEY_FILE_PATH,
// })

// const BUCKET_NAME = 'wadshs'

// export async function GET(req) {
//   const { searchParams } = new URL(req.url)
//   const id = searchParams.get('id')

//   if (!id) {
//     return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
//   }

//   const fileName = `${id}.pdf`

//   try {
//     const options = {
//       version: 'v4',
//       action: 'read',
//       expires: Date.now() + 15 * 60 * 1000, // 15 minutes
//     }

//     const [url] = await storage
//       .bucket(BUCKET_NAME)
//       .file(fileName)
//       .getSignedUrl(options)

//       console.log(url);
      

//     return NextResponse.json({ url })
//   } catch (error) {
//     console.error('Signed URL Error:', error)
//     return NextResponse.json({ error: 'File not found' }, { status: 404 })
//   }
// }


import { NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'
// import pdfParse from 'pdf-parse'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE_PATH,
})

const BUCKET_NAME = 'wadshs'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  console.log("id => ",id);

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  const fileName = `WAM232_1.pdf`
  const tmpPath = path.join(os.tmpdir(), fileName)
  console.log("tmpPath => ",tmpPath);
  try {

    const fileName = `WAM232_1.pdf`


    const bucket = storage.bucket(BUCKET_NAME);
    const corsConfiguration = [
      {
        origin: ['*'],                            // Replace '*' with allowed origins (e.g., "https://yourwebsite.com")
        responseHeader: ['Content-Type'],          // Allowed headers in the response
        method: ['GET'],  // Allowed methods
        maxAgeSeconds: 3600                        // Cache preflight response for 1 hour
      }
    ];

    await bucket.setCorsConfiguration(corsConfiguration);
    console.log(`✅ CORS configuration set for bucket: ${BUCKET_NAME}`)

    // 1. Download the file to temp location
    // await storage.bucket(BUCKET_NAME).file(fileName).download({ destination: tmpPath })
    // console.log("tmpPath => ",tmpPath);
    

    // // 2. Read and parse the file
    // const fileBuffer = await fs.readFile(tmpPath)
    // const parsed = await pdfParse(fileBuffer)

    // // 3. Clean up (optional)
    // await fs.unlink(tmpPath)
    // console.log("text => ",parsed.text);

    // const folder = path.join(process.cwd(), 'downloads') // ./downloads
    // const filePath = path.join(folder, fileName)
  
    // // Make sure the folder exists
    // await fs.mkdir(folder, { recursive: true })
  
    // await storage.bucket(BUCKET_NAME).file(fileName).download({ destination: filePath })
  
    // console.log(`✅ Downloaded to: ${filePath}`)
    

    return NextResponse.json({ text: "parsed.text" })
  } catch (error) {
    console.error('PDF Text Extraction Error:', error)
    return NextResponse.json({ error: 'Failed to extract PDF text' }, { status: 500 })
  }
}



// import { NextResponse } from 'next/server'
// import { Storage } from '@google-cloud/storage'
// import fs from 'fs/promises'
// import path from 'path'
// import { getDocument , GlobalWorkerOptions} from 'pdfjs-dist/legacy/build/pdf.mjs'
// GlobalWorkerOptions.workerSrc =
//   'https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';

// const storage = new Storage({
//   projectId: process.env.GCP_PROJECT_ID,
//   keyFilename: process.env.GCP_KEY_FILE_PATH,
// })

// const BUCKET_NAME = 'wadshs'

// export async function GET(req) {
//   const { searchParams } = new URL(req.url)
//   const id = searchParams.get('id')

//   if (!id) {
//     return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
//   }

//   const fileName = `${id}.pdf`
//   const localPath = path.join(process.cwd(), 'downloads', fileName)

//   try {
//     // Create downloads folder if not exists
//     await fs.mkdir(path.dirname(localPath), { recursive: true })

//     // Download from GCS
//     await storage.bucket(BUCKET_NAME).file(fileName).download({
//       destination: localPath,
//     })

//     // Read PDF file buffer
//     const data = await fs.readFile(localPath)

//     // Load PDF using pdfjs-dist
//     const pdfDoc = await getDocument({ data }).promise

//     let fullText = ''
//     for (let i = 1; i <= pdfDoc.numPages; i++) {
//       const page = await pdfDoc.getPage(i)
//       const content = await page.getTextContent()
//       const pageText = content.items.map((item) => item.str).join(' ')
//       fullText += pageText + '\n\n'
//     }

//     // Optionally delete file after processing
//     await fs.unlink(localPath)

//     return NextResponse.json({ text: fullText })
//   } catch (error) {
//     console.error('Error parsing PDF:', error)
//     return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 })
//   }
// }
