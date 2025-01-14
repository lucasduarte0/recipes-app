import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/services/storage';
import { auth } from '@clerk/nextjs/server';
import { S3_CONFIG } from '@/lib/s3-config';
import { rateLimit } from '@/lib/rate-limit';

// Create a rate limiter: 10 uploads per minute per user
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max number of users per interval
});

// Simple MIME type validation using magic numbers
async function validateImageSignature(buffer: Buffer): Promise<string | null> {
  const signatures = {
    'image/jpeg': [0xff, 0xd8, 0xff],
    'image/png': [0x89, 0x50, 0x4e, 0x47],
    'image/gif': [0x47, 0x49, 0x46, 0x38],
    'image/webp': [0x52, 0x49, 0x46, 0x46],
  };

  for (const [mimeType, signature] of Object.entries(signatures)) {
    if (signature.every((byte, index) => buffer[index] === byte)) {
      return mimeType;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Get the userId from auth() -- if null, the user is not signed in
    const { userId } = await auth();

    // Protect the route by checking if the user is signed in
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Apply rate limiting
    try {
      await limiter.check(request, 10, userId);
    } catch {
      return NextResponse.json({ error: 'Too many uploads. Please try again later.' }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = (formData.get('bucket') as string) || S3_CONFIG.DEFAULT_BUCKET;

    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Security check: Verify content type from the actual file
    const buffer = Buffer.from(await file.arrayBuffer());
    const actualMimeType = await validateImageSignature(buffer);

    // If file type cannot be determined or doesn't match allowed types
    if (!actualMimeType || !S3_CONFIG.ALLOWED_MIME_TYPES.includes(actualMimeType as any)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    const result = await uploadImage(buffer, file.name, actualMimeType, bucket);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          message: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in upload route:', error);

    // Return a generic error message
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request',
      },
      { status: 500 }
    );
  }
}

// Increase payload size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};
