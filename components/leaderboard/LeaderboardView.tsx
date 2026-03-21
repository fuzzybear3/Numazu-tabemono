"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RankedRestaurant } from "@/types";
import { RestaurantCard } from "./RestaurantCard";

export type RankedRestaurantWithVotes = RankedRestaurant & {
  voter_count: number;
  visit_note?: string | null;
};

type Filter = "all" | "ramen" | "sushi" | "other";
export type View = "cards" | "list";

interface Props {
  restaurants: RankedRestaurantWithVotes[];
  initialView?: View;
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function SmallVoterDots({ count }: { count: number }) {
  const dots = Math.min(count, 2);
  return (
    <div className="flex -space-x-1.5">
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className="w-5 h-5 rounded-full border border-[#504532] bg-[#353535] flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[#9c8f78] select-none" style={{ fontSize: "10px" }}>
            person
          </span>
        </div>
      ))}
      {count > 2 && (
        <div className="w-5 h-5 rounded-full border border-[#504532] bg-[#353535] flex items-center justify-center text-[9px] font-label text-[#d4c5ab]">
          +{count - 2}
        </div>
      )}
    </div>
  );
}

function VoterDots({ count }: { count: number }) {
  const dots = Math.min(count, 3);
  return (
    <div className="flex -space-x-2">
      {Array.from({ length: dots }).map((_, i) => (
        <div
          key={i}
          className="w-8 h-8 rounded-full border border-[#504532] bg-[#353535] flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-[#9c8f78] text-sm select-none">
            person
          </span>
        </div>
      ))}
      {count > 3 && (
        <div className="w-8 h-8 rounded-full border border-[#504532] bg-[#353535] flex items-center justify-center text-xs font-label text-[#d4c5ab]">
          +{count - 3}
        </div>
      )}
    </div>
  );
}

// ─── Cards view components ───────────────────────────────────────────────────

function HeroCard({ restaurant }: { restaurant: RankedRestaurantWithVotes }) {
  return (
    <article className="md:col-span-12 group">
      <div className="relative bg-[#20201f] rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-[360px] lg:h-full overflow-hidden min-h-[300px]">
            {restaurant.cover_photo_url ? (
              <Image
                src={restaurant.cover_photo_url}
                alt={restaurant.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-[#1c1b1b] flex items-center justify-center">
                <span className="text-9xl opacity-[0.04] font-headline select-none">食</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#20201f] via-transparent to-transparent" />
            <div className="absolute top-6 left-6">
              <div className="bg-[#ffbf00] text-[#402d00] w-16 h-20 rounded-b-lg flex flex-col items-center justify-center shadow-2xl ink-bleed">
                <span className="font-headline text-3xl font-bold">#1</span>
                <span className="font-label text-[10px] uppercase tracking-tighter">Rank</span>
              </div>
            </div>
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <span className="text-[#ffbf00] font-label text-xs uppercase tracking-widest font-bold">
                Recommended Quest
              </span>
              <h3 className="font-headline text-4xl text-[#e5e2e1]">{restaurant.name}</h3>
              <p className="text-[#d4c5ab]/80 italic font-body text-lg">
                {restaurant.cuisine_type ?? restaurant.cuisine_category}
              </p>
            </div>
            {restaurant.visit_note && (
              <div className="space-y-3">
                <h4 className="font-label text-xs uppercase tracking-[0.2em] text-[#9c8f78]">Tasting note</h4>
                <div className="p-5 bg-[#0e0e0e]/50 rounded-lg border-l-2 border-[#ffbf00]/30 italic text-[#d4c5ab] font-body text-sm leading-relaxed">
                  {restaurant.visit_note}
                </div>
              </div>
            )}
            {restaurant.seat_count && (
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9c8f78] select-none text-sm">chair</span>
                <span className="font-label text-xs text-[#d4c5ab]/70">{restaurant.seat_count} seats</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <VoterDots count={restaurant.voter_count} />
                <span className="font-label text-xs text-[#d4c5ab]/60">
                  {restaurant.voter_count === 1 ? "1 ranker" : `${restaurant.voter_count} rankers`}
                </span>
              </div>
              <Link href={`/restaurant/${restaurant.id}`}>
                <button className="p-3 rounded-full bg-[#393939] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-[#402d00] transition-all duration-300">
                  <span className="material-symbols-outlined select-none">arrow_forward</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function BentoCard({ restaurant }: { restaurant: RankedRestaurantWithVotes }) {
  const badgeStyle =
    restaurant.rank_position === 2 ? "bg-[#802918] text-[#ff9a85]" : "bg-[#ecc54b] text-[#675200]";
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <article className="bg-[#20201f] rounded-xl overflow-hidden shadow-xl hover:translate-y-[-4px] transition-transform duration-300">
        <div className="relative h-64">
          {restaurant.cover_photo_url ? (
            <Image src={restaurant.cover_photo_url} alt={restaurant.name} fill className="object-cover grayscale-[0.2] contrast-[1.1]" />
          ) : (
            <div className="w-full h-full bg-[#1c1b1b] flex items-center justify-center">
              <span className="text-7xl opacity-[0.04] font-headline select-none">食</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <div className={`${badgeStyle} px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl ink-bleed`}>
              <span className="font-headline text-2xl font-bold">#{restaurant.rank_position}</span>
              <span className="font-label text-xs uppercase font-bold tracking-widest">{restaurant.cuisine_category}</span>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-4">
          <h3 className="font-headline text-2xl text-[#e5e2e1]">{restaurant.name}</h3>
          {restaurant.visit_note && (
            <p className="text-[#d4c5ab] italic font-body leading-relaxed text-sm line-clamp-2">{restaurant.visit_note}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#802918] text-sm select-none">person_pin</span>
              <span className="font-label text-xs text-[#d4c5ab]/70 italic">
                {restaurant.voter_count === 1 ? "1 ranker" : `${restaurant.voter_count} rankers`}
              </span>
            </div>
            {restaurant.seat_count && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#9c8f78] select-none" style={{ fontSize: "14px" }}>chair</span>
                <span className="font-label text-xs text-[#d4c5ab]/60">{restaurant.seat_count}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

function SideCard({ restaurant }: { restaurant: RankedRestaurantWithVotes }) {
  return (
    <div className="md:col-span-5">
      <div className="bg-[#1c1b1b] p-8 rounded-xl border-l border-[#504532]/20">
        <h4 className="font-headline text-2xl mb-6 flex items-center gap-3 text-[#e5e2e1]">
          <span className="w-10 h-10 bg-[#353535] text-[#d4c5ab] flex items-center justify-center rounded-lg font-bold font-headline flex-shrink-0">
            {restaurant.rank_position}
          </span>
          <span className="truncate">{restaurant.name}</span>
        </h4>
        <Link href={`/restaurant/${restaurant.id}`}>
          <div className="aspect-square rounded-lg overflow-hidden mb-6 relative cursor-pointer">
            {restaurant.cover_photo_url ? (
              <Image src={restaurant.cover_photo_url} alt={restaurant.name} fill className="object-cover brightness-90 contrast-125" />
            ) : (
              <div className="w-full h-full bg-[#20201f] flex items-center justify-center">
                <span className="text-5xl opacity-[0.04] font-headline select-none">食</span>
              </div>
            )}
          </div>
        </Link>
        <div className="space-y-4">
          <span className="font-label text-[10px] uppercase text-[#ffbf00] tracking-widest font-bold">Master's Choice</span>
          {restaurant.visit_note && (
            <p className="text-[#d4c5ab] italic font-body text-sm line-clamp-3">{restaurant.visit_note}</p>
          )}
          {restaurant.seat_count && (
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#9c8f78] select-none" style={{ fontSize: "14px" }}>chair</span>
              <span className="font-label text-xs text-[#d4c5ab]/60">{restaurant.seat_count} seats</span>
            </div>
          )}
          <div className="pt-4 border-t border-[#504532]/10 flex items-center justify-between">
            <VoterDots count={restaurant.voter_count} />
            <span className="text-[#ffe2ab] material-symbols-outlined select-none">restaurant</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Archive view ─────────────────────────────────────────────────────────────

const archiveRowStyle: Record<number, string> = {
  1: "bg-[#2a2a2a] border-l-2 border-[#ffe2ab] shadow-[0_0_20px_rgba(255,191,0,0.05)]",
  2: "bg-[#20201f] border-l-2 border-[#ffe2ab]/40",
  3: "bg-[#20201f] border-l-2 border-[#ffe2ab]/20",
};

const archiveRankColor: Record<number, string> = {
  1: "text-[#ffe2ab]",
  2: "text-[#ffe2ab]/80",
  3: "text-[#ffe2ab]/60",
};

function ArchiveRow({ restaurant }: { restaurant: RankedRestaurantWithVotes }) {
  const rank = restaurant.rank_position;
  const isTop3 = rank <= 3;

  if (isTop3) {
    return (
      <Link href={`/restaurant/${restaurant.id}`}>
        <div className={`group flex items-center gap-3 p-3 rounded-xl ${archiveRowStyle[rank]} transition-all duration-300 hover:bg-[#393939]`}>
          <div className="w-10 flex flex-col items-center flex-shrink-0">
            <span className={`${archiveRankColor[rank]} font-headline text-xl leading-none`}>
              #{rank}
            </span>
            <span className={`text-[8px] ${archiveRankColor[rank]}/60 font-label font-bold uppercase tracking-tighter`}>
              {rank}位
            </span>
          </div>
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            {restaurant.cover_photo_url ? (
              <Image
                src={restaurant.cover_photo_url}
                alt={restaurant.name}
                fill
                className="object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all"
              />
            ) : (
              <div className="w-full h-full bg-[#353535] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#9c8f78] select-none" style={{ fontSize: "14px" }}>restaurant</span>
              </div>
            )}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className={`font-headline text-lg ${rank === 1 ? "text-[#ffe2ab]" : "text-[#e5e2e1]"} truncate`}>
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d4c5ab] select-none" style={{ fontSize: "12px" }}>
                ramen_dining
              </span>
              <span className="text-[10px] text-[#d4c5ab] font-label uppercase tracking-widest">
                {restaurant.cuisine_category}
              </span>
            </div>
          </div>
          <SmallVoterDots count={restaurant.voter_count} />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="flex items-center gap-4 py-2 px-3 border-b border-[#504532]/5 hover:bg-[#1c1b1b] transition-colors">
        <span className="w-7 text-[#d4c5ab] font-headline text-sm flex-shrink-0 text-right">
          #{rank}
        </span>
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          {restaurant.cover_photo_url ? (
            <Image src={restaurant.cover_photo_url} alt={restaurant.name} fill className="object-cover grayscale opacity-60" />
          ) : (
            <div className="w-full h-full bg-[#353535] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#9c8f78] select-none" style={{ fontSize: "12px" }}>restaurant</span>
            </div>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <span className="font-body text-sm text-[#e5e2e1]/80 truncate block">{restaurant.name}</span>
          {restaurant.cuisine_category && (
            <span className="text-[10px] text-[#ff9a85] bg-[#802918]/20 px-1 rounded font-label">
              {restaurant.cuisine_category}
            </span>
          )}
        </div>
        {restaurant.voter_count > 0 && (
          <span className="font-label text-[9px] text-[#d4c5ab]/60 flex-shrink-0">{restaurant.voter_count}×</span>
        )}
        <span className="material-symbols-outlined text-[#d4c5ab]/30 select-none" style={{ fontSize: "16px" }}>chevron_right</span>
      </div>
    </Link>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function LeaderboardView({ restaurants, initialView = "list" }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>(initialView);

  const filtered =
    filter === "all" ? restaurants : restaurants.filter((r) => r.cuisine_category === filter);
  const ranked = filtered.map((r, i) => ({ ...r, rank_position: i + 1 }));

  const rank1 = ranked[0];
  const rank2 = ranked[1];
  const rank3 = ranked[2];
  const rank4 = ranked[3];
  const rest = ranked.slice(4);

  function switchView(v: View) {
    setView(v);
    router.replace(v === "list" ? "/?view=list" : "/", { scroll: false });
  }

  return (
    <div className="space-y-8">
      {/* Controls row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 p-1 bg-[#1c1b1b] rounded-xl">
          {(["all", "ramen", "sushi", "other"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-lg font-label text-sm transition-colors ${
                filter === f
                  ? "bg-[#ffbf00] text-[#402d00] font-bold shadow-lg"
                  : "text-[#d4c5ab] hover:text-[#ffe2ab]"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#1c1b1b] rounded-xl ml-auto">
          <button
            onClick={() => switchView("cards")}
            title="Cards view"
            className={`p-2 rounded-lg transition-colors ${
              view === "cards"
                ? "bg-[#ffbf00]/10 text-[#ffbf00]"
                : "text-[#d4c5ab]/50 hover:text-[#d4c5ab]"
            }`}
          >
            <span className="material-symbols-outlined select-none" style={{ fontSize: "20px" }}>
              grid_view
            </span>
          </button>
          <button
            onClick={() => switchView("list")}
            title="List view"
            className={`p-2 rounded-lg transition-colors ${
              view === "list"
                ? "bg-[#ffbf00]/10 text-[#ffbf00]"
                : "text-[#d4c5ab]/50 hover:text-[#d4c5ab]"
            }`}
          >
            <span className="material-symbols-outlined select-none" style={{ fontSize: "20px" }}>
              format_list_numbered
            </span>
          </button>
        </div>
      </div>

      {ranked.length === 0 && (
        <p className="text-[#d4c5ab] text-center py-12 font-body italic">
          No restaurants in this category yet.
        </p>
      )}

      {/* ── List view ── */}
      {view === "list" && ranked.length > 0 && (
        <div className="space-y-1">
          {ranked.map((r) => (
            <ArchiveRow key={r.id} restaurant={r} />
          ))}
        </div>
      )}

      {/* ── Cards view ── */}
      {view === "cards" && ranked.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {rank1 && <HeroCard restaurant={rank1} />}
            {(rank2 || rank3) && (
              <div className={`${rank4 ? "md:col-span-7" : "md:col-span-12"} grid grid-cols-1 gap-12`}>
                {rank2 && <BentoCard restaurant={rank2} />}
                {rank3 && <BentoCard restaurant={rank3} />}
              </div>
            )}
            {rank4 && <SideCard restaurant={rank4} />}
          </div>

          {rest.length > 0 && (
            <div className="space-y-0.5">
              <div className="pb-3 border-b border-[#504532]/10 mb-2">
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-[#d4c5ab]/30">
                  — Further down the scroll —
                </span>
              </div>
              {rest.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
