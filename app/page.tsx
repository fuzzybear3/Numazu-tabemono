import Link from "next/link";
import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LeaderboardList } from "@/components/leaderboard/LeaderboardList";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="w-full flex justify-center border-b border-border h-14">
        <div className="w-full max-w-2xl flex justify-between items-center px-4">
          <Link href="/" className="font-bold text-lg">
            Numazu Tabemono
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/map"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Map
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </nav>

      <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Restaurant Rankings</h1>
          <p className="text-muted-foreground mt-1">
            Our definitive guide to eating well in Numazu.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-muted-foreground text-center py-12">
              Loading...
            </div>
          }
        >
          <LeaderboardList />
        </Suspense>
      </div>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Numazu Tabemono &mdash; Numazu, Japan
      </footer>
    </main>
  );
}
