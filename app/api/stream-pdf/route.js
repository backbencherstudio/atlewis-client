import { Storage } from '@google-cloud/storage';

const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILE_PATH,
  })
  
const BUCKET_NAME = process.env.GCP_BUCKET_NAME

export async function GET(req) {
  try {
    // Extract the fileName from the query parameters
    const url = new URL(req.url);
    const fileName = url.searchParams.get('fileName'); // For example: 'your-pdf-file.pdf'

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'No file name provided' }), { status: 400 });
    }

    // Create a file object in the specified bucket
    const file = storage.bucket(BUCKET_NAME).file(fileName);

    // Create a readable stream for the file
    const readStream = file.createReadStream();

    // Set the appropriate content headers
    const headers = {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"`, // Display inline in the browser
    };

    // Return the readable stream directly to the client
    return new Response(readStream, { status: 200, headers });
  } catch (error) {
    console.error('Error streaming PDF:', error);
    return new Response(JSON.stringify({ error: 'Failed to stream PDF' }), { status: 500 });
  }
}
