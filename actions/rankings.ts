"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Renumber all rankings 1..n in a single transaction.
 * The DEFERRABLE INITIALLY DEFERRED unique constraint prevents
 * violations mid-transaction.
 */
export async function reorderRankings(orderedIds: string[]) {
  const supabase = await createClient();

  // Build upsert payload
  const updates = orderedIds.map((restaurantId, index) => ({
    restaurant_id: restaurantId,
    rank_position: index + 1,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("rankings")
    .upsert(updates, { onConflict: "restaurant_id" });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
}
