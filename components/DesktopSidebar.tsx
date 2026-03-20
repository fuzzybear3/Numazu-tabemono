"use client";

import Link from "next/link";

type ActiveTab = "journal" | "rankings" | "map";

interface Props {
  activeTab?: ActiveTab;
}

const navItems = [
  {
    tab: "rankings" as ActiveTab,
    href: "/",
    icon: "format_list_numbered",
    label: "Rankings",
  },
  {
    tab: "map" as ActiveTab,
    href: "/map",
    icon: "map",
    label: "Map",
  },
];

export function DesktopSidebar({ activeTab }: Props) {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-[260px] bg-[#1c1b1b] border-r border-[#504532]/20 z-50">
      {/* Brand */}
      <div className="relative px-6 pt-8 pb-6 overflow-hidden">
        <span className="absolute -top-2 -right-1 font-headline text-[110px] text-[#d4c5ab]/[0.04] select-none pointer-events-none leading-none">
          食
        </span>
        <h1 className="font-headline italic text-xl text-[#ffbf00] drop-shadow-[0_0_8px_rgba(255,191,0,0.3)] relative z-10">
          Tamemono 食べ物
        </h1>
        <p className="font-label text-[10px] uppercase tracking-[0.25em] text-[#9c8f78] mt-1.5 relative z-10">
          Numazu, Japan
        </p>
      </div>

      <div className="mx-6 h-px bg-[#504532]/15 mb-4" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ tab, href, icon, label }) => {
          const isActive = activeTab === tab;

          return (
            <Link
              key={tab}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-[#ffbf00]/10 text-[#ffbf00]"
                  : "text-[#e5e2e1]/50 hover:text-[#e5e2e1] hover:bg-[#353535]/50"
              }`}
            >
              <span
                className="material-symbols-outlined text-xl select-none"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {icon}
              </span>
              <span className="font-label text-sm tracking-wide">{label}</span>
              {isActive && (
                <span className="ml-auto w-1 h-4 rounded-full bg-[#ffbf00]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-6 h-px bg-[#504532]/15 mb-4" />

      {/* Journal CTA */}
      <div className="px-4 pb-8">
        <Link href="/ranker">
          <button
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-label text-sm tracking-wide transition-all duration-300 ${
              activeTab === "journal"
                ? "bg-[#ffbf00] text-[#402d00] font-bold shadow-[0_4px_16px_rgba(255,191,0,0.25)]"
                : "border border-[#504532]/40 text-[#ffe2ab] hover:border-[#ffbf00]/40 hover:text-[#ffbf00]"
            }`}
          >
            <span
              className="material-symbols-outlined text-xl select-none"
              style={
                activeTab === "journal"
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              edit_note
            </span>
            Field Journal
          </button>
        </Link>
      </div>
    </aside>
  );
}
