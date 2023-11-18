"use client";

import { useState } from "react"
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import NumberInput from "@/components/NumberInput"
import { Receipt, ReceiptItem, ReceiptStatus } from "@/types";

interface SelectionMetadata {
  index: number
  selectedShare: number
  selectedQuantity: number
}

type SelectedReceiptItem = ReceiptItem & SelectionMetadata

const getReceipt = async (id: string) => {
  const res = await fetch(`/api/receipts/${id}`);
  return await res.json();
};

export default function Receipt({ params }: { params: { id: string } }) {
  const { data } = useQuery<Receipt>({
    queryKey: ["receipt", params.id],
    queryFn: () => getReceipt(params.id),
    retry: 1,
    retryDelay: 10,
  });

  const [selectedItems, setSelectedItems] = useState<SelectedReceiptItem[]>([]);

  const toggleItem = (item: ReceiptItem, index: number) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(si => si.index === index);
      if (existingItem) return prev.filter(si => si.index !== index);
      const selectedItem = { ...item, selectedQuantity: item.quantity, selectedShare: 1, index }
      return [...prev, selectedItem];
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item.index === index ? { ...item, selectedQuantity: quantity } : item
      )
    );
  };

  const updateShare = (index: number, share: number) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item.index === index ? { ...item, selectedShare: share } : item
      )
    );
  };

  const items = (data?.data?.items || []) as ReceiptItem[]
  const consumedTotal = selectedItems.reduce((acc, item) => {
    if (item.selectedShare > 1) return (item.price / item.selectedShare) + acc
    const unit_price = item.price / item.quantity
    return unit_price * item.selectedQuantity + acc
  }, 0)

  return (
    <div className="flex flex-col space-y-5">
      <div className="inline-flex flex-col items-start md:flex-row md:items-center gap-4">
        <h2 className="text-xl font-semibold">Receipt: {params.id}</h2>
        <Badge className="text-md">{data?.status === ReceiptStatus.PROCESSED ? "Processed": "Processing..."}</Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ordered</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Share</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item: ReceiptItem, index: number) => (
            <TableRow key={index}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedItems.some(si => si.name === item.name)}
                  onChange={() => toggleItem(item, index)}
                />
              </TableCell>
              <TableCell className="font-medium whitespace-nowrap">{item.name}</TableCell>
              <TableCell className="text-center">
                <NumberInput
                  value={selectedItems.find(si => index === si.index)?.selectedQuantity || item.quantity}
                  max={item.quantity}
                  onChange={(value) => updateQuantity(index, value)}
                />
              </TableCell>
              <TableCell className="text-center">
                <NumberInput
                  value={selectedItems.find(si => index === si.index)?.selectedShare || 1}
                  onChange={(value) => updateShare(index, value)}
                />
              </TableCell>
              <TableCell className="text-right">{item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">{consumedTotal.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
