"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PlacePrediction {
  place_id: string;
  description: string;
}

interface Props {
  onSelect: (placeId: string, description: string) => void;
}

export function PlacesAutocomplete({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [open, setOpen] = useState(false);
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY!,
      version: "weekly",
      libraries: ["places"],
    });

    loader.importLibrary("places").then(() => {
      autocompleteService.current =
        new google.maps.places.AutocompleteService();
    });
  }, []);

  function handleInput(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim() || !autocompleteService.current) {
      setPredictions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      autocompleteService.current!.getPlacePredictions(
        { input: value, componentRestrictions: { country: "jp" } },
        (results, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            setPredictions(
              results.map((r) => ({
                place_id: r.place_id,
                description: r.description,
              })),
            );
            setOpen(true);
          } else {
            setPredictions([]);
            setOpen(false);
          }
        },
      );
    }, 300);
  }

  function handleSelect(prediction: PlacePrediction) {
    setQuery(prediction.description);
    setPredictions([]);
    setOpen(false);
    onSelect(prediction.place_id, prediction.description);
  }

  return (
    <div className="relative">
      <Label htmlFor="places-search">Search restaurant</Label>
      <Input
        id="places-search"
        value={query}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="e.g. Sushiro Numazu"
        autoComplete="off"
        className="mt-1"
      />
      {open && predictions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((p) => (
            <li key={p.place_id}>
              <button
                type="button"
                onClick={() => handleSelect(p)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                {p.description}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
