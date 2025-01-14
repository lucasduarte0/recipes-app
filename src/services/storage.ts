import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_CONFIG, type AllowedMimeType, type AllowedBucket, ObjectCannedACL } from '@/lib/s3-config';
import { s3Client } from '@/lib/s3';
import crypto from 'crypto';

export async function validateImageType(mimeType: string): Promise<boolean> {
  return S3_CONFIG.ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType);
}

export async function validateFileSize(size: number, maxSize: number = S3_CONFIG.MAX_FILE_SIZE): Promise<boolean> {
  return size <= maxSize;
}

export async function validateBucket(bucket: string): Promise<boolean> {
  return S3_CONFIG.ALLOWED_BUCKETS.includes(bucket as AllowedBucket);
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  url?: string;
  fileName?: string;
  error?: 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'INVALID_BUCKET' | 'UPLOAD_FAILED';
}

function constructS3Url(bucket: string, key: string): string {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Storage URL not configured');
  }
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${key}`;
}

function sanitizeFileName(fileName: string, extension: string): string {
  // Generate a random hash for the filename
  const hash = crypto.randomBytes(8).toString('hex');
  const sanitized = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');

  // Add hash to prevent filename collisions and sanitize
  return `${hash}-${sanitized}.${extension}`;
}

export async function uploadImage(
  file: Buffer,
  fileName: string,
  contentType: string,
  bucket: string = S3_CONFIG.DEFAULT_BUCKET,
  preserveFileName = false
): Promise<UploadImageResponse> {
  try {
    // Validate bucket
    const isValidBucket = await validateBucket(bucket);
    if (!isValidBucket) {
      return {
        success: false,
        message: 'Invalid bucket specified',
        error: 'INVALID_BUCKET',
      };
    }

    // Validate content type
    const isValidType = await validateImageType(contentType);
    if (!isValidType) {
      return {
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed',
        error: 'INVALID_TYPE',
      };
    }

    // Check file size
    const isValidSize = await validateFileSize(file.length);
    if (!isValidSize) {
      return {
        success: false,
        message: 'File size exceeds 5MB limit',
        error: 'FILE_TOO_LARGE',
      };
    }

    // Process filename
    const extension = contentType.split('/')[1];
    const finalFileName = preserveFileName
      ? sanitizeFileName(fileName, extension)
      : `${Date.now()}-${sanitizeFileName(fileName, extension)}`;

    // Upload to S3 with private ACL by default
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: finalFileName,
        Body: file,
        ContentType: contentType,
        ACL: ObjectCannedACL.private, // Default to private
        CacheControl: 'private, no-cache, no-store, must-revalidate',
        ContentDisposition: 'attachment', // Force download rather than display
        Metadata: {
          'Original-Filename': fileName,
          'Upload-Date': new Date().toISOString(),
        },
      })
    );

    return {
      success: true,
      message: 'Image uploaded successfully',
      url: constructS3Url(bucket, finalFileName),
      fileName: finalFileName,
    };
  } catch (error) {
    // Log the error internally but don't expose details to client
    console.error('Error uploading image to S3:', error);

    return {
      success: false,
      message: 'Failed to upload image',
      error: 'UPLOAD_FAILED',
    };
  }
}
