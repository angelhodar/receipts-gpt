export enum ReceiptStatus {
  QUEUED = "queued",
  PROCESSED = "processed"
}

export interface ReceiptItem {
  quantity: number;
  price: number;
  name: string;
}

export interface Receipt {
  key: string
  status: ReceiptStatus
  data?: { items: ReceiptItem[] }
  error?: string
}