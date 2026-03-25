import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { RankedRestaurant } from "@/types";
import { DraggableRankList } from "@/components/leaderboard/DraggableRankList";

export async function RankingManager() {
  const supabase = await createClient();
  const t = await getTranslations("rankingManager");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <p className="text-muted-foreground">{t("signInToManage")}</p>;
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
        {t("failedToLoad", { message: error.message })}
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
      <p className="text-muted-foreground">{t("noRestaurantsToRank")}</p>
    );
  }

  return <DraggableRankList initialRestaurants={ranked} />;
}
