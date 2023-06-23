import {
  TextractClient,
  AnalyzeExpenseCommand,
} from "@aws-sdk/client-textract";

const textractClient = new TextractClient({});

export async function analyzeReceipt(key: string) {
  const command = new AnalyzeExpenseCommand({
    Document: {
      S3Object: {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Name: key,
      },
    },
  });

  const res = await textractClient.send(command)
  return res
}
