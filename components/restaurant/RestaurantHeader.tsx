import Image from "next/image";
import { Restaurant } from "@/types";

interface Props {
  restaurant: Restaurant;
  rankPosition?: number;
  fallbackPhotoUrl?: string | null;
}

export function RestaurantHeader({ restaurant, rankPosition, fallbackPhotoUrl }: Props) {
  const photoUrl = restaurant.cover_photo_url ?? fallbackPhotoUrl;
  return (
    <div className="space-y-4">
      {photoUrl && (
        <div className="relative h-56 w-full rounded-xl overflow-hidden">
          <Image
            src={photoUrl}
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
