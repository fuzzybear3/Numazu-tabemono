"use server";

import { createClient } from "@/lib/supabase/server";
import { getPlaceDetails } from "@/lib/google-places";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const CreateRestaurantSchema = z.object({
  google_place_id: z.string().min(1),
  cuisine_type: z.string().optional(),
  cover_photo_url: z.string().url().optional(),
});

export async function createRestaurant(formData: FormData) {
  const parsed = CreateRestaurantSchema.parse({
    google_place_id: formData.get("google_place_id"),
    cuisine_type: formData.get("cuisine_type") || undefined,
    cover_photo_url: formData.get("cover_photo_url") || undefined,
  });

  const supabase = await createClient();

  // Fetch authoritative data from Google Places (server-side key)
  const place = await getPlaceDetails(parsed.google_place_id);

  // Insert restaurant
  const { data: restaurant, error: rError } = await supabase
    .from("restaurants")
    .insert({
      name: place.name,
      address: place.address,
      lat: place.lat,
      lng: place.lng,
      google_place_id: place.place_id,
      cuisine_type: parsed.cuisine_type ?? null,
      cover_photo_url: parsed.cover_photo_url ?? null,
    })
    .select("id")
    .single();

  if (rError) throw new Error(rError.message);

  // Assign rank at bottom
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
