"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { AddVisitForm } from "./AddVisitForm";
import { Restaurant } from "@/types";

interface Props {
  restaurants: Pick<Restaurant, "id" | "name" | "cuisine_category">[];
}

export function VisitFormWithPicker({ restaurants }: Props) {
  const [selectedId, setSelectedId] = useState(restaurants[0]?.id ?? "");

  const selected = restaurants.find((r) => r.id === selectedId);

  return (
    <div className="space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="restaurant-picker">Restaurant</Label>
        <select
          id="restaurant-picker"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <AddVisitForm
          restaurantId={selectedId}
          cuisineCategory={selected?.cuisine_category ?? "other"}
        />
      )}
    </div>
  );
}
