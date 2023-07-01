import Link from "next/link";
import { Receipt } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  return (
    <header>
      <div className="flex h-20 items-center justify-between py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Receipt className="h-10 w-10" />
          <span className="font-bold text-2xl sm:inline-block">ReceiptsGPT</span>
        </Link>
        <nav>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
