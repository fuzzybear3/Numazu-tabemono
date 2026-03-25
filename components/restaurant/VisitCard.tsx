import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Visit } from "@/types";

interface Props {
  visit: Visit;
}

export async function VisitCard({ visit }: Props) {
  const locale = await getLocale();
  const dateLocale = locale === "ja" ? "ja-JP" : "en-US";
  const date = new Date(visit.visited_at).toLocaleDateString(dateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {visit.food_photo_url && (
        <div className="relative h-48 w-full">
          <Image
            src={visit.food_photo_url}
            alt={visit.menu_item ?? "Food photo"}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 space-y-1">
        <p className="text-xs text-muted-foreground">{date}</p>
        {visit.menu_item && (
          <p className="font-semibold">{visit.menu_item}</p>
        )}
        {visit.notes && (
          <p className="text-sm text-muted-foreground">{visit.notes}</p>
        )}
      </div>
    </div>
  );
}
