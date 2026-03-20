"use client";

import Link from "next/link";

interface Props {
  activeTab?: "journal" | "rankings" | "map" | "archive";
}

export function BottomNav({ activeTab }: Props) {
  return (
    <nav className="lg:hidden fixed bottom-0 w-full z-50 rounded-t-2xl bg-[#20201f]/90 backdrop-blur-xl border-t border-[#504532]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
      <div className="flex justify-around items-center h-20 px-4">
        <Link
          href="/ranker"
          className={`flex flex-col items-center justify-center transition-all duration-300 ${
            activeTab === "journal"
              ? "text-[#ffbf00] scale-110"
              : "text-[#e5e2e1]/40 hover:text-[#ffe2ab]"
          }`}
        >
          <span className="material-symbols-outlined mb-1 select-none">
            edit_note
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest">
            Journal
          </span>
        </Link>

        <Link
          href="/"
          className={`flex flex-col items-center justify-center transition-all duration-300 ${
            activeTab === "rankings"
              ? "text-[#ffbf00] scale-110"
              : "text-[#e5e2e1]/40 hover:text-[#ffe2ab]"
          }`}
        >
          <span
            className="material-symbols-outlined mb-1 select-none"
            style={
              activeTab === "rankings"
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            restaurant
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest">
            Rankings
          </span>
        </Link>

        <Link
          href="/map"
          className={`flex flex-col items-center justify-center transition-all duration-300 ${
            activeTab === "map"
              ? "text-[#ffbf00] scale-110"
              : "text-[#e5e2e1]/40 hover:text-[#ffe2ab]"
          }`}
        >
          <span className="material-symbols-outlined mb-1 select-none">
            map
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest">
            Map
          </span>
        </Link>

        <Link
          href="/?view=list"
          className={`flex flex-col items-center justify-center transition-all duration-300 ${
            activeTab === "archive"
              ? "text-[#ffbf00] scale-110"
              : "text-[#e5e2e1]/40 hover:text-[#ffe2ab]"
          }`}
        >
          <span className="material-symbols-outlined mb-1 select-none">
            format_list_numbered
          </span>
          <span className="font-label text-[10px] uppercase tracking-widest">
            List
          </span>
        </Link>
      </div>
    </nav>
  );
}
