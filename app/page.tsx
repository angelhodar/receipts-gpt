import UploadReceipt from "@/components/UploadReceipt";
import { FileScan, QrCode, BadgeDollarSign } from "lucide-react";

export default function Home() {
  return (
    <div>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-bold font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Easily take your part of your receipt
          </h1>
          <p className="mt-4 max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Simply take a photo of the receipt, upload it and you will just need
            to select your consumption
          </p>
          <div className="mt-6">
            <UploadReceipt />
          </div>
        </div>
      </section>
      <section id="features" className="container space-y-6 py-4">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold font-heading text-2xl sm:text-4xl md:text-5xl">
            Just 3 simple steps
          </h2>
        </div>
        <div className="pt-4 mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <FileScan className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Scan</h3>
                <p className="text-sm text-muted-foreground">
                  Take a photo or upload your receipt in a few seconds
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <QrCode className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Share</h3>
                <p className="text-sm text-muted-foreground">
                  Let your friends scan the QR code or copy the link
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <BadgeDollarSign className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">Select</h3>
                <p className="text-sm text-muted-foreground">
                  Easily take the items you have consumed and let the web calculate the cost
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
