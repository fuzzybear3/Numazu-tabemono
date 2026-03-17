"use client";

import { useState } from "react";
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RankedRestaurant } from "@/types";
import { RestaurantPin } from "./RestaurantPin";
import { RestaurantSidebar } from "./RestaurantSidebar";

// Numazu, Japan
const INITIAL_VIEW = {
  longitude: 138.8691,
  latitude: 35.1,
  zoom: 13,
};

interface Props {
  restaurants: RankedRestaurant[];
}

export function MapView({ restaurants }: Props) {
  const [selected, setSelected] = useState<RankedRestaurant | null>(null);

  return (
    <div className="relative w-full h-full">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={INITIAL_VIEW}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {restaurants.map((restaurant) => (
          <RestaurantPin
            key={restaurant.id}
            restaurant={restaurant}
            onClick={setSelected}
          />
        ))}
      </Map>

      <RestaurantSidebar
        restaurant={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
