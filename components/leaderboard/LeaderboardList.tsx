import { createClient } from "@/lib/supabase/server";
import { RankedRestaurant } from "@/types";
import { LeaderboardView, View, RankedRestaurantWithVotes } from "./LeaderboardView";

export async function LeaderboardList({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const initialView: View = params.view === "cards" ? "cards" : "list";
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("global_rankings")
    .select(
      `
      avg_position,
      voter_count,
      restaurants (
        id, name, address, lat, lng,
        google_place_id, cuisine_type, cuisine_category, cover_photo_url, seat_count, created_at,
        visits ( food_photo_url, notes )
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
    .map((row, index) => {
      const restaurant = row.restaurants as unknown as RankedRestaurant & {
        visits?: { food_photo_url: string | null; notes: string | null }[];
      };
      const photosWithNotes = restaurant.visits?.filter((v) => v.food_photo_url) ?? [];
      // Deterministic pick by restaurant ID so server and client render the same image
      const idSum = restaurant.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const pickedVisit = photosWithNotes[idSum % photosWithNotes.length];
      return {
        ...restaurant,
        rank_position: index + 1,
        voter_count: row.voter_count ?? 1,
        cover_photo_url: restaurant.cover_photo_url ?? pickedVisit?.food_photo_url ?? null,
        visit_note: pickedVisit?.notes ?? null,
      };
    });

  return <LeaderboardView restaurants={ranked} initialView={initialView} />;
}
