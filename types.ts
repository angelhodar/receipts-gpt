export interface ReceiptItem {
  quantity: number;
  unit_price: number;
  price: number;
  name: string;
  raw?: string;
}

export enum ReceiptStatus {
  QUEUED = "queued",
  SCANNED = "scanned",
  PROCESSED = "processed"
}

export interface ReceiptResponse {
  status: ReceiptStatus
  items: ReceiptItem[]
}
