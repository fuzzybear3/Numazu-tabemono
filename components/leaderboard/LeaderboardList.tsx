import { createClient } from "@/lib/supabase/server";
import { RankedRestaurant } from "@/types";
import { LeaderboardView } from "./LeaderboardView";

export type RankedRestaurantWithVotes = RankedRestaurant & { voter_count: number };

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
      <p className="text-red-400 font-label">
        Failed to load leaderboard: {error.message}
      </p>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="text-[#d4c5ab] text-center py-12 font-body italic">
        No restaurants ranked yet.
      </p>
    );
  }

  const ranked: RankedRestaurantWithVotes[] = data
    .filter((row) => row.restaurants)
    .map((row, index) => ({
      ...(row.restaurants as unknown as RankedRestaurant),
      rank_position: index + 1,
      voter_count: row.voter_count ?? 1,
    }));

  return <LeaderboardView restaurants={ranked} />;
}
