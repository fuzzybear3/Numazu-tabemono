import { Suspense } from "react";
import Link from "next/link";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  return (
    <main className="min-h-screen bg-[#131313] selection:bg-[#ffbf00] selection:text-[#402d00]">
      {/* Noise overlay */}
      <div className="noise-overlay fixed inset-0 z-[100]" />

      <DesktopSidebar activeTab="rankings" />

      {/* Mobile TopAppBar — hidden on desktop */}
      <header className="lg:hidden bg-[#131313] top-0 sticky z-50">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <span className="material-symbols-outlined text-[#ffbf00] cursor-pointer select-none">
            menu
          </span>
          <h1 className="font-headline italic tracking-wide text-2xl text-[#ffbf00] drop-shadow-[0_0_8px_rgba(255,191,0,0.4)]">
            Tamemono 食べ物
          </h1>
          <Link href="/ranker">
            <div className="w-10 h-10 rounded-full bg-[#353535] flex items-center justify-center overflow-hidden border border-[#504532]/30 hover:border-[#504532]/60 transition-colors">
              <span className="material-symbols-outlined text-[#9c8f78] text-xl select-none">
                person
              </span>
            </div>
          </Link>
        </div>
        <div className="bg-gradient-to-b from-[#20201f] to-transparent h-1" />
      </header>

      {/* Main content */}
      <div className="lg:pl-[260px]">
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-32 lg:pb-12 space-y-12">
          <section>
            <h2 className="font-headline text-4xl md:text-5xl text-[#e5e2e1]">
              Leaderboard
            </h2>
          </section>

          <Suspense
            fallback={
              <div className="text-[#d4c5ab] text-center py-12 font-body italic">
                Loading the scroll...
              </div>
            }
          >
            <LeaderboardList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>

      {/* FAB — mobile only */}
      <div className="lg:hidden fixed bottom-24 right-6 z-40">
        <Link href="/ranker">
          <button className="w-14 h-14 rounded-full bg-[#ffbf00] text-[#402d00] shadow-[0_8px_25px_rgba(255,191,0,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300">
            <span className="material-symbols-outlined text-3xl select-none">add</span>
          </button>
        </Link>
      </div>

      <BottomNav activeTab="rankings" />
    </main>
  );
}
