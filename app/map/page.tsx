import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RankedRestaurant } from "@/types";
import { MapView } from "@/components/map/MapView";

async function MapContent() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("rankings")
    .select(
      `
      rank_position,
      restaurants (
        id, name, address, lat, lng,
        google_place_id, cuisine_type, cover_photo_url, created_at
      )
    `,
    )
    .order("rank_position", { ascending: true });

  const restaurants: RankedRestaurant[] = (data ?? [])
    .filter((row) => row.restaurants)
    .map((row) => ({
      ...(row.restaurants as unknown as RankedRestaurant),
      rank_position: row.rank_position,
    }));

  return <MapView restaurants={restaurants} />;
}

export default function MapPage() {
  return (
    <div className="h-screen flex flex-col">
      <nav className="w-full flex justify-between items-center px-4 h-14 border-b border-border flex-shrink-0">
        <Link href="/" className="font-bold text-lg">
          Numazu Tabemono
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Leaderboard
        </Link>
      </nav>

      <div className="flex-1 relative">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Loading map...
            </div>
          }
        >
          <MapContent />
        </Suspense>
      </div>
    </div>
  );
}
