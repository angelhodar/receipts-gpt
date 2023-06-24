"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Input } from "@/components/ui/input"

const UploadReceiptInput = ({
  onReceiptUpload,
}: {
  onReceiptUpload: (id: string) => void;
}) => {
  const uploadReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;

    const url = new URL("/api/upload", window.origin);

    url.searchParams.append("file", file.name);
    url.searchParams.append("fileType", file.type);

    const res = await fetch(url.href);

    const { url: uploadUrl, fields } = await res.json();

    const formData = new FormData();

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    console.log({ uploadUrl, fields })

    const abortController = new AbortController();
    const { signal } = abortController;

    const upload = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      signal
    });

    if (upload.ok) {
      console.log("Uploaded successfully!");
      const id = fields.key.split(".")[0]
      onReceiptUpload(id);
    } else {
      console.error("Upload failed.");
    }
  };

  return (
    <div className="flex flex-col justify-center space-y-2">
      <Input
        onChange={uploadReceipt}
        type="file"
        accept="image/*"
        //className="p-3 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-100 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      />
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
        PNG, JPG or GIF (max 10MB)
      </p>
    </div>
  );
};

const UploadReceiptResult = ({ id }: { id: string }) => {
  const url = new URL(id, window.location.origin)
  return <QRCode value={url.href} />
};

export default function UploadReceipt() {
  const [uploadedReceipt, setUploadedReceipt] = useState("");

  if (uploadedReceipt) return <UploadReceiptResult id={uploadedReceipt} />;

  return <UploadReceiptInput onReceiptUpload={setUploadedReceipt} />;
}
