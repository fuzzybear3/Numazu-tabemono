import { Suspense } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";
import { BottomNav } from "@/components/BottomNav";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { MobileMenuDrawer } from "@/components/MobileMenuDrawer";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const t = await getTranslations("home");
  return (
    <main className="min-h-screen bg-[#131313] selection:bg-[#ffbf00] selection:text-[#402d00]">
      {/* Noise overlay */}
      <div className="noise-overlay fixed inset-0 z-[100]" />

      <DesktopSidebar activeTab="rankings" />

      {/* Mobile TopAppBar — hidden on desktop */}
      <header className="lg:hidden bg-[#131313] top-0 sticky z-50">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <MobileMenuDrawer />
          <h1 className="font-headline italic tracking-wide text-2xl text-[#ffbf00] drop-shadow-[0_0_8px_rgba(255,191,0,0.4)]">
            Tabemono 食べ物
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
              {t("leaderboard")}
            </h2>
          </section>

          <Suspense
            fallback={
              <div className="text-[#d4c5ab] text-center py-12 font-body italic">
                {t("loading")}
              </div>
            }
          >
            <LeaderboardList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>

      <BottomNav activeTab="rankings" />
    </main>
  );
}
