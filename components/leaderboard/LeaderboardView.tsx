"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RankedRestaurant } from "@/types";
import { RestaurantCard } from "./RestaurantCard";

export type RankedRestaurantWithVotes = RankedRestaurant & { voter_count: number };

type Filter = "all" | "ramen" | "sushi" | "other";

interface Props {
  restaurants: RankedRestaurantWithVotes[];
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
                <span className="text-9xl opacity-[0.04] font-headline select-none">
                  食
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#20201f] via-transparent to-transparent" />
            <div className="absolute top-6 left-6">
              <div className="bg-[#ffbf00] text-[#402d00] w-16 h-20 rounded-b-lg flex flex-col items-center justify-center shadow-2xl ink-bleed">
                <span className="font-headline text-3xl font-bold">#1</span>
                <span className="font-label text-[10px] uppercase tracking-tighter">
                  Rank
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <span className="text-[#ffbf00] font-label text-xs uppercase tracking-widest font-bold">
                Recommended Quest
              </span>
              <h3 className="font-headline text-4xl text-[#e5e2e1]">
                {restaurant.name}
              </h3>
              <p className="text-[#d4c5ab]/80 italic font-body text-lg">
                {restaurant.cuisine_type ?? restaurant.cuisine_category}
              </p>
            </div>

            {restaurant.address && (
              <div className="space-y-3">
                <h4 className="font-label text-xs uppercase tracking-[0.2em] text-[#9c8f78]">
                  Location
                </h4>
                <div className="p-5 bg-[#0e0e0e]/50 rounded-lg border-l-2 border-[#ffbf00]/30 italic text-[#d4c5ab] font-body text-sm leading-relaxed">
                  {restaurant.address}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3">
                <VoterDots count={restaurant.voter_count} />
                <span className="font-label text-xs text-[#d4c5ab]/60">
                  {restaurant.voter_count === 1
                    ? "1 ranker"
                    : `${restaurant.voter_count} rankers`}
                </span>
              </div>
              <Link href={`/restaurant/${restaurant.id}`}>
                <button className="p-3 rounded-full bg-[#393939] text-[#ffbf00] hover:bg-[#ffbf00] hover:text-[#402d00] transition-all duration-300">
                  <span className="material-symbols-outlined select-none">
                    arrow_forward
                  </span>
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
    restaurant.rank_position === 2
      ? "bg-[#802918] text-[#ff9a85]"
      : "bg-[#ecc54b] text-[#675200]";

  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <article className="bg-[#20201f] rounded-xl overflow-hidden shadow-xl hover:translate-y-[-4px] transition-transform duration-300">
        <div className="relative h-64">
          {restaurant.cover_photo_url ? (
            <Image
              src={restaurant.cover_photo_url}
              alt={restaurant.name}
              fill
              className="object-cover grayscale-[0.2] contrast-[1.1]"
            />
          ) : (
            <div className="w-full h-full bg-[#1c1b1b] flex items-center justify-center">
              <span className="text-7xl opacity-[0.04] font-headline select-none">
                食
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <div
              className={`${badgeStyle} px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl ink-bleed`}
            >
              <span className="font-headline text-2xl font-bold">
                #{restaurant.rank_position}
              </span>
              <span className="font-label text-xs uppercase font-bold tracking-widest">
                {restaurant.cuisine_category}
              </span>
            </div>
          </div>
        </div>
        <div className="p-8 space-y-4">
          <h3 className="font-headline text-2xl text-[#e5e2e1]">
            {restaurant.name}
          </h3>
          {restaurant.address && (
            <p className="text-[#d4c5ab] italic font-body leading-relaxed text-sm">
              {restaurant.address}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#802918] text-sm select-none">
              person_pin
            </span>
            <span className="font-label text-xs text-[#d4c5ab]/70 italic">
              {restaurant.voter_count === 1
                ? "1 ranker"
                : `${restaurant.voter_count} rankers`}
            </span>
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
              <Image
                src={restaurant.cover_photo_url}
                alt={restaurant.name}
                fill
                className="object-cover brightness-90 contrast-125"
              />
            ) : (
              <div className="w-full h-full bg-[#20201f] flex items-center justify-center">
                <span className="text-5xl opacity-[0.04] font-headline select-none">
                  食
                </span>
              </div>
            )}
          </div>
        </Link>
        <div className="space-y-4">
          <span className="font-label text-[10px] uppercase text-[#ffbf00] tracking-widest font-bold">
            Master's Choice
          </span>
          {restaurant.address && (
            <p className="text-[#d4c5ab] italic font-body text-sm">
              {restaurant.address}
            </p>
          )}
          <div className="pt-4 border-t border-[#504532]/10 flex items-center justify-between">
            <VoterDots count={restaurant.voter_count} />
            <span className="text-[#ffe2ab] material-symbols-outlined select-none">
              restaurant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeaderboardView({ restaurants }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all"
      ? restaurants
      : restaurants.filter((r) => r.cuisine_category === filter);

  const ranked = filtered.map((r, i) => ({ ...r, rank_position: i + 1 }));

  const rank1 = ranked[0];
  const rank2 = ranked[1];
  const rank3 = ranked[2];
  const rank4 = ranked[3];
  const rest = ranked.slice(4);

  return (
    <div className="space-y-12">
      {/* Filter row */}
      <div className="flex items-center gap-2 p-1 bg-[#1c1b1b] rounded-xl w-fit">
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

      {ranked.length === 0 && (
        <p className="text-[#d4c5ab] text-center py-12 font-body italic">
          No restaurants in this category yet.
        </p>
      )}

      {/* Leaderboard grid */}
      {ranked.length > 0 && (
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
      )}

      {/* Compact rows for ranks 5+ */}
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
    </div>
  );
}
