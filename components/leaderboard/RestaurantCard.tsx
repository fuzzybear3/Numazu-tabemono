import Link from "next/link";
import Image from "next/image";
import { RankedRestaurant } from "@/types";

interface Props {
  restaurant: RankedRestaurant;
}

export function RestaurantCard({ restaurant }: Props) {
  return (
    <Link
      href={`/restaurant/${restaurant.id}`}
      className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
    >
      <span className="text-2xl font-bold text-muted-foreground w-8 text-center flex-shrink-0">
        {restaurant.rank_position}
      </span>

      {restaurant.cover_photo_url ? (
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={restaurant.cover_photo_url}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🍜</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{restaurant.name}</p>
        <p className="text-sm text-muted-foreground truncate">
          {restaurant.address}
        </p>
        {restaurant.cuisine_type && (
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {restaurant.cuisine_type}
          </span>
        )}
      </div>
    </Link>
  );
}
