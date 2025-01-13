import { NextResponse } from 'next/server';
import { uploadImage, isValidImageType, isValidFileSize, listBuckets } from '@/services/storage';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!isValidImageType(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size
    if (!isValidFileSize(file.size)) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const result = await uploadImage(buffer, file.name, file.type);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: result.url,
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await listBuckets();

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({
      buckets: result.buckets,
    });
  } catch (error) {
    console.error('Error listing buckets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
