"use client";

import { useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { Share2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

    const abortController = new AbortController();
    const { signal } = abortController;

    const upload = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      signal,
    });

    if (upload.ok) {
      console.log("Uploaded successfully!");
      const id = fields.key.split(".")[0];
      const url = new URL(id, window.location.origin).href;
      onReceiptUpload(url);
    } else {
      console.error("Upload failed.");
    }
  };

  return (
    <div className="flex flex-col justify-center space-y-2">
      <Input onChange={uploadReceipt} type="file" accept="image/*" />
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
        PNG, JPG or GIF (max 10MB)
      </p>
    </div>
  );
};

const UploadReceiptResult = ({ url }: { url: string }) => {
  return (
    <div className="flex flex-col space-y-5 justify-center">
      <h3 className="font-bold font-heading text-xl sm:text-2xl md:text-3xl">
        Your receipt is being processed...
      </h3>
      <div className="flex flex-col space-y-5 md:flex-row md:space-x-10 md:space-y-0 items-center md:items-start">
        <div className="flex flex-col space-y-2 items-center justify-center">
          <Input value={url} readOnly />
          <div className="flex space-x-3">
            <Button variant="outline" className="shrink-0">
              <Share2 className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" className="shrink-0" asChild>
              <Link href={url}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Go to receipt
              </Link>
            </Button>
          </div>
        </div>
        <QRCode value={url} size={192} />
      </div>
    </div>
  );
};

export default function UploadReceipt() {
  const [uploadedReceipt, setUploadedReceipt] = useState("hola");

  if (uploadedReceipt) return <UploadReceiptResult url={uploadedReceipt} />;

  return <UploadReceiptInput onReceiptUpload={setUploadedReceipt} />;
}
