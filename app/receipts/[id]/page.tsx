"use client";

import { useQuery } from "@tanstack/react-query";
import ReceiptItem from "@/components/ReceiptItem";
import { Badge } from "@/components/ui/badge";
import { ReceiptResponse } from "@/types";

const getReceipt = async (id: string) => {
  const res = await fetch(`/api/receipts/${id}`);
  return await res.json();
};

export default function Receipt({ params }: { params: { id: string } }) {
  const { data } = useQuery<ReceiptResponse>({
    queryKey: ["receipt", params.id],
    queryFn: () => getReceipt(params.id),
    retry: 5,
    retryDelay: 8,
  });

  console.log(data)

  return (
    <div className="flex flex-col space-y-5">
      <h2 className="text-xl font-semibold">Receipt: {params.id}</h2>
      <span>
        Status: <Badge>{data?.status}</Badge>
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {data?.items &&
          data?.items
            .filter((item) => item.price > 0)
            .map((item, i) => <ReceiptItem key={i} item={item}></ReceiptItem>)}
      </div>
    </div>
  );
}
