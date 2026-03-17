"use client";

import { Marker } from "react-map-gl";
import { RankedRestaurant } from "@/types";

interface Props {
  restaurant: RankedRestaurant;
  onClick: (restaurant: RankedRestaurant) => void;
}

export function RestaurantPin({ restaurant, onClick }: Props) {
  return (
    <Marker
      longitude={restaurant.lng}
      latitude={restaurant.lat}
      anchor="bottom"
    >
      <button
        onClick={() => onClick(restaurant)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg hover:scale-110 transition-transform border-2 border-background"
        title={restaurant.name}
      >
        {restaurant.rank_position}
      </button>
    </Marker>
  );
}
