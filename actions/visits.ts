"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const CreateVisitSchema = z.object({
  restaurant_id: z.string().uuid(),
  visited_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  menu_item: z.string().optional(),
  food_photo_url: z.string().url().optional(),
  notes: z.string().optional(),
});

export async function createVisit(formData: FormData) {
  const parsed = CreateVisitSchema.parse({
    restaurant_id: formData.get("restaurant_id"),
    visited_at: formData.get("visited_at"),
    menu_item: formData.get("menu_item") || undefined,
    food_photo_url: formData.get("food_photo_url") || undefined,
    notes: formData.get("notes") || undefined,
  });

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("visits").insert({
    restaurant_id: parsed.restaurant_id,
    visited_at:    parsed.visited_at,
    menu_item:     parsed.menu_item ?? null,
    food_photo_url: parsed.food_photo_url ?? null,
    notes:         parsed.notes ?? null,
    user_id:       user.id,
  });

  if (error) throw new Error(error.message);

  // Add restaurant to user's rankings if not already there
  const { data: existing } = await supabase
    .from("rankings")
    .select("id")
    .eq("user_id", user.id)
    .eq("restaurant_id", parsed.restaurant_id)
    .maybeSingle();

  if (!existing) {
    const { data: maxRank } = await supabase
      .from("rankings")
      .select("rank_position")
      .eq("user_id", user.id)
      .order("rank_position", { ascending: false })
      .limit(1)
      .maybeSingle();

    await supabase.from("rankings").insert({
      restaurant_id: parsed.restaurant_id,
      rank_position: (maxRank?.rank_position ?? 0) + 1,
      user_id:       user.id,
    });
  }

  revalidatePath(`/restaurant/${parsed.restaurant_id}`);
  revalidatePath("/ranker");
  revalidatePath("/");
}
