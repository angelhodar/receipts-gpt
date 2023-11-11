import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = "eu-west-3"
const bucket = process.env.AWS_S3_BUCKET_NAME as string

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region
});

const expirationTime = 600; // seconds
const imageExtensions = ["jpg", "jpeg", "png", "webp"];

export function getStorageObjectUrl(objectKey: string) {
  return `https://${bucket}.s3.${region}.amazonaws.com/${objectKey}`;
}

export async function getReceiptStorageKey(id: string) {
  // List objects in the bucket with the given prefix
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: id,
  });

  const listObjectsResponse = await s3Client.send(listObjectsCommand);

  // Find the first key that has an image extension
  for (const obj of listObjectsResponse.Contents || []) {
    const extension = obj?.Key?.split(".").at(-1);
    if (!extension) continue;
    if (imageExtensions.includes(extension.toLowerCase())) {
      return obj.Key as string;
    }
  }

  return null
}

export async function generatePresignedURL(file: string) {
  const ext = file.split(".").at(-1);
  const newFileName = `${crypto.randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: newFileName
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: expirationTime });

  return url;
}
