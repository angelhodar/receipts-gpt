import ProcessSteps from "@/components/ProcessSteps";
import UploadReceipt from "@/components/UploadReceipt";

export default function Home() {
  return (
    <main className="flex max-w-6xl mx-auto items-center text-center flex-col py-2 mt-28">
      <h1 className="max-w-4xl font-display text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl">
        Share your receipt and take your part of the bill
      </h1>

      <p className="mt-12 max-w-xl text-lg text-slate-700 leading-7">
        Simply take a photo of the receipt, upload it and you will just need to
        take your part
      </p>
      <div className="mt-6">
        <UploadReceipt />
      </div>
      <ProcessSteps />
    </main>
  );
}
