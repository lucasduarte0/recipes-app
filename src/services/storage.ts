import { ObjectCannedACL, S3Client, ListBucketsCommand, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

export type UploadImageResponse = {
  success: boolean;
  message: string;
  url?: string;
};

// Initialize S3 client
const s3Client = new S3Client({
  forcePathStyle: true,
  region: process.env.AWS_REGION!,
  endpoint: process.env.AWS_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImage(
  file: Buffer,
  fileName: string,
  contentType: string,
  bucket = process.env.AWS_BUCKET_NAME,
  preserveFileName = false // New parameter to control filename behavior
): Promise<UploadImageResponse> {
  try {
    // Use original filename if preserveFileName is true, otherwise generate unique name
    const finalFileName = preserveFileName ? fileName : `${Date.now()}-${fileName}`;

    const params = {
      Bucket: bucket,
      Key: `${finalFileName}`,
      Body: file,
      ContentType: contentType,
      ACL: ObjectCannedACL.public_read,
    };

    // Check if file exists before upload (optional)
    if (preserveFileName) {
      try {
        const headCommand = new HeadObjectCommand({
          Bucket: bucket,
          Key: finalFileName,
        });
        await s3Client.send(headCommand);
        // File exists, will be overwritten
      } catch (err) {
        // File doesn't exist, will be created
      }
    }

    // Upload to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Generate the URL for the uploaded image
    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${finalFileName}`;

    return {
      success: true,
      message: preserveFileName ? 'Image replaced successfully' : 'Image uploaded successfully',
      url: imageUrl,
    };
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload image',
    };
  }
}

// Helper function to validate file type
export function isValidImageType(mimeType: string): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(mimeType);
}

// Helper function to validate file size (in bytes)
export function isValidFileSize(size: number, maxSize: number = 5 * 1024 * 1024): boolean {
  return size <= maxSize; // Default max size is 5MB
}

export async function listBuckets() {
  try {
    const command = new ListBucketsCommand({});
    const { Buckets } = await s3Client.send(command);

    if (!Buckets) {
      return {
        success: true,
        buckets: [],
      };
    }

    const buckets = Buckets.map((bucket) => ({
      name: bucket.Name,
      creationDate: bucket.CreationDate,
    }));

    return {
      success: true,
      buckets,
    };
  } catch (error) {
    console.error('Error listing buckets:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to list buckets',
    };
  }
}
