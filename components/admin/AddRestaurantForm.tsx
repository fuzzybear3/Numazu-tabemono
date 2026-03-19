"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [place, setPlace] = useState<SelectedPlace | null>(null);
  const [manualName, setManualName] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isGpsPlace = place?.osm_key.startsWith("gps/");

  function handlePlaceSelect(result: NominatimResult) {
    setPlace({
      osm_key: nominatimPlaceKey(result),
      name: extractName(result.display_name),
      address: result.display_name,
      lat: result.lat,
      lng: result.lon,
    });
    setManualName("");
    setSuccess(false);
    setError(null);
    setLocationError(null);
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(7);
        const lng = pos.coords.longitude.toFixed(7);
        setPlace({
          osm_key: `gps/${Date.now()}`,
          name: "",
          address: `${lat}, ${lng}`,
          lat,
          lng,
        });
        setManualName("");
        setLocating(false);
        setSuccess(false);
        setError(null);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Location access denied. Please allow location in your browser."
            : "Could not get your location. Try again."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!place) {
      setError("Please search for a restaurant or use your location.");
      return;
    }

    const finalName = isGpsPlace ? manualName.trim() : place.name;
    if (!finalName) {
      setError("Please enter the restaurant name.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("place_id", place.osm_key);
    formData.set("name", finalName);
    formData.set("address", place.address);
    formData.set("lat", place.lat);
    formData.set("lng", place.lng);

    setError(null);
    startTransition(async () => {
      try {
        await createRestaurant(formData);
        setSuccess(true);
        setPlace(null);
        setManualName("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add restaurant");
      }
    });
  }

  const osmEditorUrl =
    place && isGpsPlace
      ? `https://www.openstreetmap.org/edit?editor=id#map=19/${place.lat}/${place.lng}`
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PlacesAutocomplete onSelect={handlePlaceSelect} />

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleUseMyLocation}
        disabled={locating}
        className="w-full"
      >
        {locating ? "Getting location..." : "📍 Use my current location"}
      </Button>

      {locationError && (
        <p className="text-sm text-destructive">{locationError}</p>
      )}

      {/* GPS mode: show coordinates + manual name entry + OSM link */}
      {place && isGpsPlace && (
        <div className="rounded-md border border-border bg-muted/40 p-3 space-y-3">
          <p className="text-xs text-muted-foreground">
            📍 {place.lat}, {place.lng}
          </p>

          <div className="grid gap-1.5">
            <Label htmlFor="manual-name">Restaurant name</Label>
            <Input
              id="manual-name"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              placeholder="e.g. Ramen Hyaku-shiki"
              autoFocus
            />
          </div>

          {osmEditorUrl && (
            <a
              href={osmEditorUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:underline"
            >
              Also add to OpenStreetMap ↗
            </a>
          )}
        </div>
      )}

      <input type="hidden" name="place_id" value={place?.osm_key ?? ""} />
      <input type="hidden" name="address"  value={place?.address ?? ""} />
      <input type="hidden" name="lat"      value={place?.lat ?? ""} />
      <input type="hidden" name="lng"      value={place?.lng ?? ""} />

      <div className="grid gap-1.5">
        <Label htmlFor="cuisine_category">Category</Label>
        <select
          id="cuisine_category"
          name="cuisine_category"
          defaultValue="other"
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="other">Other</option>
          <option value="ramen">Ramen</option>
          <option value="tonkatsu">Tonkatsu</option>
          <option value="sushi">Sushi</option>
        </select>
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
