import { Receipt } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto mx-auto py-12 md:flex-row">
      <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
        <Receipt />
        <p className="text-center text-sm leading-loose md:text-left">
          Built by{" "}
          <a
            href="https://angelhodar.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            angelhodar
          </a>
          . The source code is available on{" "}
          <a
            href="https://github.com/angelhodar/receipts-gpt"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
