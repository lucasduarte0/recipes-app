import { ObjectCannedACL } from '@aws-sdk/client-s3';

// Constants
export const S3_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB limit
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
  ALLOWED_BUCKETS: ['profiles', 'recipes'] as const,
  DEFAULT_BUCKET: 'profiles' as const,
} as const;

export type AllowedMimeType = (typeof S3_CONFIG.ALLOWED_MIME_TYPES)[number];
export type AllowedBucket = (typeof S3_CONFIG.ALLOWED_BUCKETS)[number];

// Response types
export interface S3Response {
  success: boolean;
  message?: string;
}

export interface Bucket {
  name: string;
  creationDate?: Date;
}

export interface ListBucketsResponse extends S3Response {
  buckets: Bucket[];
}

export { ObjectCannedACL };
