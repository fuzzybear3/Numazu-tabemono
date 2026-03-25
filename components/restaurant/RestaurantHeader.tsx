import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Restaurant } from "@/types";

interface Props {
  restaurant: Restaurant;
  rankPosition?: number;
  fallbackPhotoUrl?: string | null;
}

export async function RestaurantHeader({ restaurant, rankPosition, fallbackPhotoUrl }: Props) {
  const t = await getTranslations("restaurantDetail");
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
        <div className="flex items-center justify-between gap-3 mt-1">
          <p className="text-muted-foreground text-sm">{restaurant.address}</p>
          <a
            href={`https://maps.google.com?q=${restaurant.lat},${restaurant.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#353535] text-[#ffe2ab] font-label text-xs tracking-wide hover:bg-[#ffbf00] hover:text-[#402d00] transition-all duration-300"
          >
            <span className="material-symbols-outlined select-none" style={{ fontSize: "16px" }}>navigation</span>
            {t("navigate")}
          </a>
        </div>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {restaurant.cuisine_type && (
            <span className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
              {restaurant.cuisine_type}
            </span>
          )}
          {restaurant.seat_count && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <span className="material-symbols-outlined select-none" style={{ fontSize: "16px" }}>chair</span>
              {t("seats", { count: restaurant.seat_count })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
