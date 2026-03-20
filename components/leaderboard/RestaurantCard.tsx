import Link from "next/link";
import Image from "next/image";
import { RankedRestaurant } from "@/types";

interface Props {
  restaurant: RankedRestaurant & { voter_count?: number };
}

export function RestaurantCard({ restaurant }: Props) {
  return (
    <Link href={`/restaurant/${restaurant.id}`}>
      <div className="flex items-center gap-4 py-2 px-3 border-b border-[#504532]/5 hover:bg-[#1c1b1b] transition-colors">
        <span className="w-7 text-[#d4c5ab] font-headline text-sm flex-shrink-0 text-right">
          #{restaurant.rank_position}
        </span>
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          {restaurant.cover_photo_url ? (
            <Image
              src={restaurant.cover_photo_url}
              alt={restaurant.name}
              fill
              className="object-cover grayscale opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-[#353535] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#9c8f78] text-xs select-none">
                restaurant
              </span>
            </div>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <span className="font-body text-sm text-[#e5e2e1]/80 truncate block">
            {restaurant.name}
          </span>
          {restaurant.cuisine_category && (
            <span className="text-[10px] text-[#ff9a85] bg-[#802918]/20 px-1 rounded font-label">
              {restaurant.cuisine_category}
            </span>
          )}
        </div>
        {restaurant.voter_count != null && restaurant.voter_count > 0 && (
          <span className="font-label text-[9px] text-[#d4c5ab]/60 flex-shrink-0">
            {restaurant.voter_count}×
          </span>
        )}
        <span className="material-symbols-outlined text-[#d4c5ab]/30 text-sm flex-shrink-0 select-none">
          chevron_right
        </span>
      </div>
    </Link>
  );
}
