"use client";

import { useState, useTransition } from "react";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { createRestaurant } from "@/actions/restaurants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddRestaurantForm() {
  const [placeId, setPlaceId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handlePlaceSelect(selectedPlaceId: string) {
    setPlaceId(selectedPlaceId);
    setSuccess(false);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!placeId) {
      setError("Please select a restaurant from the suggestions.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("google_place_id", placeId);

    setError(null);
    startTransition(async () => {
      try {
        await createRestaurant(formData);
        setSuccess(true);
        setPlaceId("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add restaurant");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PlacesAutocomplete onSelect={handlePlaceSelect} />

      <input type="hidden" name="google_place_id" value={placeId} />

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
        <p className="text-sm text-green-600">
          Restaurant added successfully!
        </p>
      )}

      <Button type="submit" disabled={isPending || !placeId}>
        {isPending ? "Adding..." : "Add restaurant"}
      </Button>
    </form>
  );
}
