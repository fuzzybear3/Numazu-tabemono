import { createClient } from "@/lib/supabase/server";
import { RankedRestaurant } from "@/types";
import { RestaurantCard } from "./RestaurantCard";

export async function LeaderboardList() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("global_rankings")
    .select(
      `
      avg_position,
      voter_count,
      restaurants (
        id, name, address, lat, lng,
        google_place_id, cuisine_type, cuisine_category, cover_photo_url, created_at
      )
    `,
    )
    .order("avg_position", { ascending: true });

  if (error) {
    return (
      <p className="text-destructive">Failed to load leaderboard: {error.message}</p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-12">
        No restaurants ranked yet. Add some from the admin panel!
      </p>
    );
  }

  const ranked: RankedRestaurant[] = data
    .filter((row) => row.restaurants)
    .map((row, index) => ({
      ...(row.restaurants as unknown as RankedRestaurant),
      rank_position: index + 1,
    }));

  return (
    <div className="flex flex-col gap-2">
      {ranked.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
