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

  const { error } = await supabase.from("visits").insert({
    restaurant_id: parsed.restaurant_id,
    visited_at: parsed.visited_at,
    menu_item: parsed.menu_item ?? null,
    food_photo_url: parsed.food_photo_url ?? null,
    notes: parsed.notes ?? null,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/restaurant/${parsed.restaurant_id}`);
  revalidatePath("/admin");
}
