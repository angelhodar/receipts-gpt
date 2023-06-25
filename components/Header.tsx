import Link from "next/link";
import { Receipt } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  return (
    <header>
      <div className="flex h-20 items-center justify-between py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Receipt />
          <span className="font-bold sm:inline-block">ReceiptsGPT</span>
        </Link>
        <nav>
          <DarkModeToggle />
        </nav>
      </div>
    </header>
  );
}
