import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export default function RankerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#131313]">
      <header className="bg-[#131313] top-0 sticky z-50">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="material-symbols-outlined text-[#ffbf00] cursor-pointer select-none">
                arrow_back
              </span>
            </Link>
            <h1 className="font-headline italic tracking-wide text-2xl text-[#ffbf00] drop-shadow-[0_0_8px_rgba(255,191,0,0.4)]">
              Field Journal
            </h1>
          </div>
          <LogoutButton />
        </div>
        <div className="bg-gradient-to-b from-[#20201f] to-transparent h-1" />
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
