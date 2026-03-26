"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { LanguageToggle } from "@/components/LanguageToggle";

export function MobileMenuDrawer() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();

  const navItems = [
    { href: "/", icon: "format_list_numbered", label: t("rankings") },
    { href: "/map", icon: "map", label: t("map") },
    { href: "/ranker", icon: "edit_note", label: t("journal") },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-[#ffbf00] select-none">
          menu
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-[201] bg-[#1c1b1b] border-r border-[#504532]/20 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative px-6 pt-8 pb-6 overflow-hidden">
          <span className="absolute -top-2 -right-1 font-headline text-[110px] text-[#d4c5ab]/[0.04] select-none pointer-events-none leading-none">
            食
          </span>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-[#9c8f78] hover:text-[#e5e2e1] transition-colors"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined select-none">close</span>
          </button>
          <h1 className="font-headline italic text-xl text-[#ffbf00] drop-shadow-[0_0_8px_rgba(255,191,0,0.3)] relative z-10">
            Tabemono 食べ物
          </h1>
          <p className="font-label text-[10px] uppercase tracking-[0.25em] text-[#9c8f78] mt-1.5 relative z-10">
            Numazu, Japan
          </p>
        </div>

        <div className="mx-6 h-px bg-[#504532]/15 mb-4" />

        {/* Nav */}
        <nav className="px-3 space-y-0.5">
          {navItems.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#e5e2e1]/50 hover:text-[#e5e2e1] hover:bg-[#353535]/50 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-xl select-none">
                {icon}
              </span>
              <span className="font-label text-sm tracking-wide">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mx-6 h-px bg-[#504532]/15 my-4" />

        {/* Language toggle */}
        <div className="px-4 pb-4 flex justify-end">
          <LanguageToggle currentLocale={locale} />
        </div>
      </div>
    </>
  );
}
