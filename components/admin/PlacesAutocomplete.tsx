"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NominatimResult } from "@/lib/nominatim";

interface Props {
  onSelect: (result: NominatimResult) => void;
}

export function PlacesAutocomplete({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleInput(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.searchParams.set("q", value);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "5");
        url.searchParams.set("countrycodes", "jp");

        const res = await fetch(url.toString(), {
          headers: { "User-Agent": "NumazuTabemono/1.0" },
        });
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        setResults([]);
        setOpen(false);
      }
    }, 300);
  }

  function handleSelect(result: NominatimResult) {
    setQuery(result.display_name);
    setResults([]);
    setOpen(false);
    onSelect(result);
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
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((r) => (
            <li key={`${r.osm_type}/${r.osm_id}`}>
              <button
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
