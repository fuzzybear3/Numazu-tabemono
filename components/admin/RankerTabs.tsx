"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Tab = "visit" | "add" | "rankings";

interface Props {
  visitContent: React.ReactNode;
  addContent: React.ReactNode;
  rankingsContent: React.ReactNode;
}

export function RankerTabs({ visitContent, addContent, rankingsContent }: Props) {
  const [active, setActive] = useState<Tab>("visit");
  const t = useTranslations("rankerTabs");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "visit", label: t("logVisit"), icon: "edit_note" },
    { id: "add", label: t("addPlace"), icon: "add_location_alt" },
    { id: "rankings", label: t("rankings"), icon: "reorder" },
  ];

  const content = { visit: visitContent, add: addContent, rankings: rankingsContent };

  return (
    <div className="space-y-8">
      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 bg-[#1c1b1b] rounded-xl">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-label text-sm transition-all duration-300 ${
              active === id
                ? "bg-[#ffbf00] text-[#402d00] font-bold shadow-lg"
                : "text-[#d4c5ab] hover:text-[#ffe2ab]"
            }`}
          >
            <span
              className="material-symbols-outlined select-none"
              style={{
                fontSize: "18px",
                fontVariationSettings: active === id ? "'FILL' 1" : undefined,
              }}
            >
              {icon}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>{content[active]}</div>
    </div>
  );
}
