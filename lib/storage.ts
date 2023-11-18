import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = "eu-west-3"
const bucket = process.env.AWS_S3_BUCKET_NAME as string

const client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region
})

export async function getReceiptStorageKey(id: string) {
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: id,
  });

  const listObjectsResponse = await client.send(listObjectsCommand);

  if (!listObjectsResponse.Contents || listObjectsResponse.Contents.length === 0) return null

  const [receipt] = listObjectsResponse.Contents

  return receipt.Key || null
}

export async function generatePresignedURL(file: string, type: string) {
  const ext = file.split(".").at(-1);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: `${crypto.randomUUID()}.${ext}`,
    ContentType: type
  });

  const url = await getSignedUrl(client, command, { expiresIn: 600 /* seconds */ });

  return url;
}

export async function upload(key: string, buffer: Buffer) {
  const uploadCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: 'image/webp',
  });

  await client.send(uploadCommand);
}

export function getReceiptURLFromID(objectKey: string) {
  return `https://receiptsgpt.s3.eu-west-3.amazonaws.com/${objectKey}`;
}

export async function remove(key: string) {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,

  });

  await client.send(deleteCommand);
}
