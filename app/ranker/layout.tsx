import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";

export default async function RankerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#131313]">
      <DesktopSidebar activeTab="journal" />

      {/* Mobile header — hidden on desktop */}
      <header className="lg:hidden bg-[#131313] top-0 sticky z-50">
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
          {user && <LogoutButton />}
        </div>
        <div className="bg-gradient-to-b from-[#20201f] to-transparent h-1" />
      </header>

      {/* Desktop: offset for sidebar, add logout to top-right */}
      <div className="lg:pl-[260px]">
        {user && (
          <div className="hidden lg:flex justify-end items-center px-8 py-4 border-b border-[#504532]/10">
            <LogoutButton />
          </div>
        )}

        <div className="flex-1">
          {user ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
              <span className="font-headline text-[80px] text-[#d4c5ab]/[0.06] select-none leading-none">
                錠
              </span>
              <div className="space-y-2">
                <h2 className="font-headline text-3xl text-[#e5e2e1]">
                  Rankers Only
                </h2>
                <p className="font-body italic text-[#d4c5ab]">
                  You need to be signed in to log visits and manage rankings.
                </p>
              </div>
              <Link href="/auth/login">
                <button className="px-8 py-3 rounded-xl bg-[#ffbf00] text-[#402d00] font-label font-bold text-sm tracking-wide shadow-[0_4px_16px_rgba(255,191,0,0.25)] hover:scale-105 active:scale-95 transition-all duration-300">
                  Sign in
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <BottomNav activeTab="journal" />
    </div>
  );
}
