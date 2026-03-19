import { createClient } from "@/lib/supabase/server";
import { RankedRestaurant } from "@/types";
import { DraggableRankList } from "@/components/leaderboard/DraggableRankList";

export async function RankingManager() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <p className="text-muted-foreground">Sign in to manage your rankings.</p>;
  }

  const { data, error } = await supabase
    .from("rankings")
    .select(
      `
      rank_position,
      restaurants (
        id, name, address, lat, lng,
        google_place_id, cuisine_type, cuisine_category, cover_photo_url, created_at
      )
    `,
    )
    .eq("user_id", user.id)
    .order("rank_position", { ascending: true });

  if (error) {
    return (
      <p className="text-destructive">
        Failed to load rankings: {error.message}
      </p>
    );
  }

  const ranked: RankedRestaurant[] = (data ?? [])
    .filter((row) => row.restaurants)
    .map((row) => ({
      ...(row.restaurants as unknown as RankedRestaurant),
      rank_position: row.rank_position,
    }));

  if (ranked.length === 0) {
    return (
      <p className="text-muted-foreground">No restaurants to rank yet.</p>
    );
  }

  return <DraggableRankList initialRestaurants={ranked} />;
}
