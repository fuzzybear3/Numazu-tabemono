"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const CuisineCategorySchema = z.enum(['ramen', 'tonkatsu', 'sushi', 'other']).default('other');

const CreateRestaurantSchema = z.object({
  place_id:         z.string().min(1),
  name:             z.string().min(1),
  address:          z.string().min(1),
  lat:              z.coerce.number(),
  lng:              z.coerce.number(),
  cuisine_category: CuisineCategorySchema,
  cover_photo_url:  z.string().url().optional(),
});

export async function createRestaurant(formData: FormData) {
  const parsed = CreateRestaurantSchema.parse({
    place_id:         formData.get("place_id"),
    name:             formData.get("name"),
    address:          formData.get("address"),
    lat:              formData.get("lat"),
    lng:              formData.get("lng"),
    cuisine_category: formData.get("cuisine_category") || undefined,
    cover_photo_url:  formData.get("cover_photo_url") || undefined,
  });

  const supabase = await createClient();

  const { data: restaurant, error: rError } = await supabase
    .from("restaurants")
    .insert({
      name:             parsed.name,
      address:          parsed.address,
      lat:              parsed.lat,
      lng:              parsed.lng,
      google_place_id:  parsed.place_id,
      cuisine_category: parsed.cuisine_category,
      cover_photo_url:  parsed.cover_photo_url ?? null,
    })
    .select("id")
    .single();

  if (rError) throw new Error(rError.message);

  revalidatePath("/");
  revalidatePath("/ranker");

  return { id: restaurant.id };
}
