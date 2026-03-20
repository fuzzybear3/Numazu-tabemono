import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RankedRestaurant } from "@/types";
import { MapView } from "@/components/map/MapView";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { BottomNav } from "@/components/BottomNav";

async function MapContent() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("global_rankings")
    .select(
      `
      avg_position,
      restaurants (
        id, name, address, lat, lng,
        google_place_id, cuisine_type, cover_photo_url, created_at
      )
    `,
    )
    .order("avg_position", { ascending: true });

  const restaurants: RankedRestaurant[] = (data ?? [])
    .filter((row) => row.restaurants)
    .map((row, index) => ({
      ...(row.restaurants as unknown as RankedRestaurant),
      rank_position: index + 1,
    }));

  return <MapView restaurants={restaurants} />;
}

export default function MapPage() {
  return (
    <div className="h-screen flex bg-[#131313]">
      <DesktopSidebar activeTab="map" />

      <div className="flex-1 flex flex-col lg:pl-[260px] h-full">
        {/* Mobile nav — hidden on desktop */}
        <nav className="lg:hidden w-full flex justify-between items-center px-4 h-14 border-b border-[#504532]/20 flex-shrink-0 bg-[#131313]">
          <Link href="/" className="font-headline italic text-lg text-[#ffbf00]">
            Tamemono
          </Link>
          <Link
            href="/"
            className="text-sm text-[#d4c5ab] hover:text-[#ffe2ab] transition-colors font-label"
          >
            Rankings
          </Link>
        </nav>

        <div className="flex-1 relative">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full text-[#d4c5ab] font-body italic">
                Loading map...
              </div>
            }
          >
            <MapContent />
          </Suspense>
        </div>
      </div>

      <BottomNav activeTab="map" />
    </div>
  );
}
