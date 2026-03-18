"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const CreateRestaurantSchema = z.object({
  place_id:        z.string().min(1),
  name:            z.string().min(1),
  address:         z.string().min(1),
  lat:             z.coerce.number(),
  lng:             z.coerce.number(),
  cuisine_type:    z.string().optional(),
  cover_photo_url: z.string().url().optional(),
});

export async function createRestaurant(formData: FormData) {
  const parsed = CreateRestaurantSchema.parse({
    place_id:        formData.get("place_id"),
    name:            formData.get("name"),
    address:         formData.get("address"),
    lat:             formData.get("lat"),
    lng:             formData.get("lng"),
    cuisine_type:    formData.get("cuisine_type") || undefined,
    cover_photo_url: formData.get("cover_photo_url") || undefined,
  });

  const supabase = await createClient();

  const { data: restaurant, error: rError } = await supabase
    .from("restaurants")
    .insert({
      name:            parsed.name,
      address:         parsed.address,
      lat:             parsed.lat,
      lng:             parsed.lng,
      google_place_id: parsed.place_id, // stores "node/12345" — no schema change needed
      cuisine_type:    parsed.cuisine_type ?? null,
      cover_photo_url: parsed.cover_photo_url ?? null,
    })
    .select("id")
    .single();

  if (rError) throw new Error(rError.message);

  const { data: maxRank } = await supabase
    .from("rankings")
    .select("rank_position")
    .order("rank_position", { ascending: false })
    .limit(1)
    .single();

  const nextPosition = (maxRank?.rank_position ?? 0) + 1;

  const { error: rankError } = await supabase.from("rankings").insert({
    restaurant_id: restaurant.id,
    rank_position: nextPosition,
  });

  if (rankError) throw new Error(rankError.message);

  revalidatePath("/");
  revalidatePath("/admin");

  return { id: restaurant.id };
}
