"use client";

import { useState } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  Camera,
  Share2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { getReceiptIDFromURL } from "@/lib/utils";

const UploadReceiptInput = ({
  onReceiptUpload,
}: {
  onReceiptUpload: (id: string) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const uploadReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]!;

    const url = new URL("/api/upload", window.origin);

    url.searchParams.append("file", file.name);
    url.searchParams.append("type", file.type);

    setUploading(true);

    const res = await fetch(url.href);

    const { url: uploadUrl } = await res.json();

    const { signal } = new AbortController();

    try {
      const upload = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        signal,
      });

      if (upload.ok) {
        console.log("Uploaded successfully!");
        const id = getReceiptIDFromURL(uploadUrl)
        const url = new URL(id, window.location.origin + "/receipts/").href;
        onReceiptUpload(url);
      } else {
        console.error("Upload failed.");
        setError(true);
      }
    } catch (err) {
      console.log(err);
    }

    setUploading(false);
  };

  if (error)
    return (
      <div className="flex flex-col space-y-4 jutify-center items-center border border-gray-300 rounded-lg px-5 py-3">
        <p className="font-semibold text-md text-red-500">
          Error uploading your receipt
        </p>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (uploading)
    return (
      <div className="flex flex-col space-y-4 jutify-center items-center border border-gray-300 rounded-lg px-5 py-3">
        <p className="font-semibold text-md">Uploading your receipt...</p>
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-x-6 md:space-y-0">
        <Label className="hover:cursor-pointer">
          <Button variant="outline" asChild>
            <div className="space-x-2">
              <UploadCloud className="w-6 h-6" />
              <p className="text-lg">Upload from gallery</p>
            </div>
          </Button>
          <Input
            onChange={uploadReceipt}
            type="file"
            accept="image/*"
            className="hidden"
          />
        </Label>
        <Label className="hover:cursor-pointer">
          <Button variant="outline" className="p-3" asChild>
            <div className="space-x-2">
              <Camera className="w-6 h-6" />
              <p className="text-lg">Take a picture</p>
            </div>
          </Button>
          <Input
            onChange={uploadReceipt}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
          />
        </Label>
      </div>
    </div>
  );
};

const UploadReceiptResult = ({ url }: { url: string }) => {
  return (
    <div className="flex flex-col space-y-5 justify-center">
      <h3 className="font-bold font-heading text-xl sm:text-2xl md:text-3xl">
        See your receipt in the url below
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
  const [uploadedReceipt, setUploadedReceipt] = useState("");

  if (uploadedReceipt) return <UploadReceiptResult url={uploadedReceipt} />;

  return <UploadReceiptInput onReceiptUpload={setUploadedReceipt} />;
}
