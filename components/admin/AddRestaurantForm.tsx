"use client";

import { useState, useTransition } from "react";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { createRestaurant } from "@/actions/restaurants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NominatimResult } from "@/lib/nominatim";
import { nominatimPlaceKey } from "@/lib/nominatim";

interface SelectedPlace {
  osm_key: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
}

function extractName(displayName: string): string {
  return displayName.split(",")[0].trim();
}

export function AddRestaurantForm() {
  const [place, setPlace] = useState<SelectedPlace | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handlePlaceSelect(result: NominatimResult) {
    setPlace({
      osm_key: nominatimPlaceKey(result),
      name: extractName(result.display_name),
      address: result.display_name,
      lat: result.lat,
      lng: result.lon,
    });
    setSuccess(false);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!place) {
      setError("Please select a restaurant from the suggestions.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("place_id", place.osm_key);
    formData.set("name", place.name);
    formData.set("address", place.address);
    formData.set("lat", place.lat);
    formData.set("lng", place.lng);

    setError(null);
    startTransition(async () => {
      try {
        await createRestaurant(formData);
        setSuccess(true);
        setPlace(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add restaurant");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PlacesAutocomplete onSelect={handlePlaceSelect} />

      <input type="hidden" name="place_id" value={place?.osm_key ?? ""} />
      <input type="hidden" name="name"     value={place?.name ?? ""} />
      <input type="hidden" name="address"  value={place?.address ?? ""} />
      <input type="hidden" name="lat"      value={place?.lat ?? ""} />
      <input type="hidden" name="lng"      value={place?.lng ?? ""} />

      <div className="grid gap-1.5">
        <Label htmlFor="cuisine_type">Cuisine type (optional)</Label>
        <Input
          id="cuisine_type"
          name="cuisine_type"
          placeholder="e.g. Sushi, Ramen, Izakaya"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">Restaurant added successfully!</p>
      )}

      <Button type="submit" disabled={isPending || !place}>
        {isPending ? "Adding..." : "Add restaurant"}
      </Button>
    </form>
  );
}
