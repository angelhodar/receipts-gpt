export enum ReceiptStatus {
  QUEUED = "queued",
  PROCESSED = "processed"
}

export interface ReceiptItem {
  quantity: number;
  unit_price: number;
  price: number;
  name: string;
}

export interface Receipt {
  key: string
  status: ReceiptStatus
  data?: { items: ReceiptItem[], total: number }
}