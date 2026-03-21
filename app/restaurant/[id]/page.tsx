import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Restaurant, Visit } from "@/types";
import { RestaurantHeader } from "@/components/restaurant/RestaurantHeader";
import { VisitGallery } from "@/components/restaurant/VisitGallery";

interface Props {
  params: Promise<{ id: string }>;
}

async function RestaurantContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [restaurantResult, rankingResult, visitsResult] = await Promise.all([
    supabase.from("restaurants").select("*").eq("id", id).single(),
    supabase
      .from("rankings")
      .select("rank_position")
      .eq("restaurant_id", id)
      .single(),
    supabase
      .from("visits")
      .select("*")
      .eq("restaurant_id", id)
      .order("visited_at", { ascending: false }),
  ]);

  if (restaurantResult.error || !restaurantResult.data) {
    notFound();
  }

  const restaurant = restaurantResult.data as Restaurant;
  const rankPosition = rankingResult.data?.rank_position;
  const visits = (visitsResult.data ?? []) as Visit[];

  const photos = visits.filter((v) => v.food_photo_url);
  const fallbackPhotoUrl =
    restaurant.cover_photo_url ??
    photos[Math.floor(Math.random() * photos.length)]?.food_photo_url ??
    null;

  return (
    <div className="space-y-8">
      <RestaurantHeader restaurant={restaurant} rankPosition={rankPosition} fallbackPhotoUrl={fallbackPhotoUrl} />
      <div>
        <h2 className="text-xl font-semibold mb-4">Visit history</h2>
        <VisitGallery visits={visits} />
      </div>
    </div>
  );
}

export default function RestaurantPage({ params }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full flex justify-between items-center px-4 h-14 border-b border-border">
        <Link href="/" className="font-bold text-lg">
          Numazu Tabemono
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Leaderboard
        </Link>
      </nav>

      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
        <Suspense
          fallback={
            <p className="text-muted-foreground text-center py-12">
              Loading...
            </p>
          }
        >
          <RestaurantContent params={params} />
        </Suspense>
      </div>
    </div>
  );
}
