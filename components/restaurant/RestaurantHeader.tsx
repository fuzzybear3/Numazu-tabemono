import Image from "next/image";
import { Restaurant } from "@/types";

interface Props {
  restaurant: Restaurant;
  rankPosition?: number;
}

export function RestaurantHeader({ restaurant, rankPosition }: Props) {
  return (
    <div className="space-y-4">
      {restaurant.cover_photo_url && (
        <div className="relative h-56 w-full rounded-xl overflow-hidden">
          <Image
            src={restaurant.cover_photo_url}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <div>
        <div className="flex items-center gap-3">
          {rankPosition !== undefined && (
            <span className="text-3xl font-bold text-muted-foreground">
              #{rankPosition}
            </span>
          )}
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        </div>
        <p className="text-muted-foreground mt-1">{restaurant.address}</p>
        {restaurant.cuisine_type && (
          <span className="inline-block mt-2 text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
            {restaurant.cuisine_type}
          </span>
        )}
      </div>
    </div>
  );
}
