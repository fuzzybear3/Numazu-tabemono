"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  currentLocale: string;
}

export function LanguageToggle({ currentLocale }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale() {
    const next = currentLocale === "en" ? "ja" : "en";
    document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="font-label text-xs tracking-widest uppercase text-[#9c8f78] hover:text-[#ffe2ab] transition-colors px-2 py-1 rounded border border-[#504532]/30 hover:border-[#504532]/60 disabled:opacity-50"
    >
      {currentLocale === "en" ? "日本語" : "English"}
    </button>
  );
}
