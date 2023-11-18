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
import { Receipt, ReceiptItem } from "@/types";

type SelectedReceiptItem = ReceiptItem & { share: number }

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
      const existingIndex = prev.findIndex(si => si.name === item.name);
      if (existingIndex !== -1) {
        return prev.filter((_, i) => i !== existingIndex);
      }
      return [...prev, { ...item, share: 1 }];
    });
  };

  const updateQuantity = (itemName: string, quantity: number) => {
    setSelectedItems(prev =>
      prev.map(item => 
        item.name === itemName ? { ...item, quantity } : item
      )
    );
  };

  const updateShare = (itemName: string, share: number) => {
    setSelectedItems(prev =>
      prev.map(item => 
        item.name === itemName ? { ...item, share } : item
      )
    );
  };

  const items = (data?.data?.items || []) as ReceiptItem[]
  const total = items.reduce((acc, item) => acc + item.price, 0)

  return (
    <div className="flex flex-col space-y-5">
      <div className="inline-flex flex-row items-center space-x-2">
        <h2 className="text-xl font-semibold">Receipt: {params.id}</h2>
        <Badge className="text-md">{data?.status}</Badge>
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
          {items.map((item: ReceiptItem, i: number) => (
            <TableRow key={i}>
              <TableCell>
                <input 
                  type="checkbox" 
                  checked={selectedItems.some(si => si.name === item.name)} 
                  onChange={() => toggleItem(item, i)} 
                />
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-center">
                <NumberInput 
                  value={selectedItems.find(si => si.name === item.name)?.quantity || item.quantity} 
                  onChange={(value) => updateQuantity(item.name, value)} 
                />
              </TableCell>
              <TableCell className="text-center">
                <NumberInput 
                  value={selectedItems.find(si => si.name === item.name)?.share || 1} 
                  onChange={(value) => updateShare(item.name, value)} 
                  //disabled={!selectedItems.some(si => si.name === item.name)} 
                />
              </TableCell>
              <TableCell className="text-right">{item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">{total.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
