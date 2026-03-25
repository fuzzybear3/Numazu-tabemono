"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { RankedRestaurant } from "@/types";
import { Button } from "@/components/ui/button";

interface Props {
  restaurant: RankedRestaurant | null;
  onClose: () => void;
}

export function RestaurantSidebar({ restaurant, onClose }: Props) {
  const t = useTranslations("map");
  if (!restaurant) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl z-10 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <span className="font-semibold text-lg truncate">{restaurant.name}</span>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xl leading-none ml-2"
          aria-label={t("close")}
        >
          ✕
        </button>
      </div>

      {restaurant.cover_photo_url && (
        <div className="relative h-40 w-full flex-shrink-0">
          <Image
            src={restaurant.cover_photo_url}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">#{restaurant.rank_position}</span>
          {restaurant.cuisine_type && (
            <span className="text-sm px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {restaurant.cuisine_type}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{restaurant.address}</p>
      </div>

      <div className="p-4 border-t border-border">
        <Button asChild className="w-full">
          <Link href={`/restaurant/${restaurant.id}`}>{t("viewDetails")}</Link>
        </Button>
      </div>
    </div>
  );
}
