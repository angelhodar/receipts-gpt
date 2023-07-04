import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: "eu-west-3",
});

const maxUploadFileSize = 10485760; // 10 MB
const expirationTime = 600; // seconds
const imageExtensions = ["jpg", "jpeg", "png"];

export async function findImageKey(prefix: string) {
  // List objects in the bucket with the given prefix
  const listObjectsCommand = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: prefix,
  });

  const listObjectsResponse = await s3Client.send(listObjectsCommand);

  // Find the first key that has an image extension
  for (const obj of listObjectsResponse.Contents || []) {
    const extension = obj?.Key?.split(".").at(-1);
    if (!extension) continue;
    if (imageExtensions.includes(extension.toLowerCase())) {
      return obj.Key;
    }
  }

  throw new Error(`No image file found with the given key ${prefix}`);
}

export async function getReceiptMetadata(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  try {
    const res = await s3Client.send(command);
    const metadata = await res.Body?.transformToString();
    console.log("Fetched receipt metadata for file: " + key);
    return JSON.parse(metadata as string);
  } catch (e) {
    const error = e as Error;
    if (error.name === "NoSuchKey") {
      console.error(`The specified file ${key} does not exist on S3`);
    } else {
      console.error("An error occurred:", error);
    }
  }

  return null;
}

export async function uploadReceiptMetadata(key: string, body: any) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(body),
  });

  try {
    await s3Client.send(command);
    console.log("Uploaded metadata for file: " + key);
    return true;
  } catch (e) {
    const error = e as Error;
    if (error.name === "NoSuchKey") {
      console.error(`Cant upload file with id ${key} to S3`);
    } else {
      console.error("An error occurred:", error);
    }
  }

  return false;
}

export async function generatePresignedURL(file: string, type: string) {
  const ext = file.split(".").at(-1);
  const newFileName = `${crypto.randomUUID()}.${ext}`;

  const presignedData = await createPresignedPost(s3Client, {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: newFileName,
    Fields: { "Content-Type": type },
    Expires: expirationTime,
    Conditions: [["content-length-range", 0, maxUploadFileSize]],
  });

  console.log("Generated presgiend url for file: " + newFileName);

  return presignedData;
}
