import { NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE_PATH,
})

const BUCKET_NAME = 'newsletter-pdfs'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  const fileName = `${id}.pdf`

  try {
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    }

    const [url] = await storage
      .bucket(BUCKET_NAME)
      .file(fileName)
      .getSignedUrl(options)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Signed URL Error:', error)
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
