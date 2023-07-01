"use client";

import { useQuery } from "@tanstack/react-query";

const getReceipt = async (id: string) => {
  const res = await fetch(`/api/receipts/${id}`);
  return await res.json();
};

export default function Receipt({ params }: { params: { id: string } }) {
  const { data } = useQuery({
    queryKey: ["receipt", params.id],
    queryFn: () => getReceipt(params.id),
    retry: 5,
    retryDelay: 5,
  });

  return (
    <div>
      <div>Receipt: {params.id}</div>
      <div>Status: {data?.status}</div>
      <div>Items: {JSON.stringify(data?.items)}</div>
    </div>
  );
}
