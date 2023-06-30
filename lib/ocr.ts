import {
  TextractClient,
  AnalyzeExpenseCommand,
  DetectDocumentTextCommand,
  AnalyzeExpenseCommandOutput,
  ExpenseField,
  Block,
  DetectDocumentTextCommandOutput,
  BlockType,
} from "@aws-sdk/client-textract";
import { ReceiptItem } from "../types";

const textractClient = new TextractClient({});

const parseExpenseResponse = (
  res: AnalyzeExpenseCommandOutput
): ReceiptItem[] => {
  if (
    !res?.ExpenseDocuments ||
    res.ExpenseDocuments.length === 0 ||
    !res.ExpenseDocuments[0]?.LineItemGroups ||
    res.ExpenseDocuments[0].LineItemGroups.length === 0 ||
    !res.ExpenseDocuments[0]?.LineItemGroups[0]?.LineItems
  )
    throw new Error("No expense items to analyze");

  const items = res.ExpenseDocuments[0]?.LineItemGroups[0]?.LineItems;

  const parsed = items.map((receiptItem) => {
    const itemData = {} as ReceiptItem;

    for (const elem of receiptItem.LineItemExpenseFields as ExpenseField[]) {
      if (elem.Type?.Text === "QUANTITY")
        itemData.quantity = Number(elem.ValueDetection?.Text) || 0;
      if (elem.Type?.Text === "PRICE")
        itemData.price = Number(elem.ValueDetection?.Text) || 0;
      if (elem.Type?.Text === "UNIT_PRICE")
        itemData.unit_price = Number(elem.ValueDetection?.Text) || 0;
      if (elem.Type?.Text === "ITEM")
        itemData.name = elem.ValueDetection?.Text as string;
      if (elem.Type?.Text === "EXPENSE_ROW")
        itemData.raw = elem.ValueDetection?.Text as string;
    }

    return itemData;
  });

  return parsed;
};

const extractRawTextFromBlocks = (
  res: DetectDocumentTextCommandOutput
): string => {
  const lineBlocks = res.Blocks?.filter((b) => b.BlockType === BlockType.LINE);
  let rawText = "";
  for (const line of lineBlocks as Block[])
    rawText += (line.Text as string) + "\n";
  return rawText;
};

export async function analyzeReceiptWithExpenseAPI(key: string) {
  const command = new AnalyzeExpenseCommand({
    Document: {
      S3Object: {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Name: key,
      },
    },
  });

  const res = await textractClient.send(command);
  const parsed = parseExpenseResponse(res);

  return { metadata: res, parsed };
}

export async function analyzeReceiptWithDocumentAPI(key: string) {
  const command = new DetectDocumentTextCommand({
    Document: {
      S3Object: {
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Name: key,
      },
    },
  });

  const metadata = await textractClient.send(command);
  const rawText = extractRawTextFromBlocks(metadata);

  return { metadata, rawText };
}
