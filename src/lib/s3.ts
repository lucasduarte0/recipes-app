import { S3Client } from '@aws-sdk/client-s3';

const config = {
  forcePathStyle: true,
  region: process.env.AWS_REGION ?? 'us-west-1',
  endpoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
};

// S3 client for server-side operations
export const s3Client = new S3Client(config);
