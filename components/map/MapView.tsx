"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { RankedRestaurant } from "@/types";
import { RestaurantSidebar } from "./RestaurantSidebar";

// Leaflet touches `window` at module load — must be ssr:false
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface Props {
  restaurants: RankedRestaurant[];
}

export function MapView({ restaurants }: Props) {
  const [selected, setSelected] = useState<RankedRestaurant | null>(null);

  return (
    <div className="relative w-full h-full">
      <LeafletMap restaurants={restaurants} onSelect={setSelected} />
      <RestaurantSidebar
        restaurant={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
