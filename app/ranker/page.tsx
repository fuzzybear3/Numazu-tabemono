import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Restaurant } from "@/types";
import { AddRestaurantForm } from "@/components/admin/AddRestaurantForm";
import { RankingManager } from "@/components/admin/RankingManager";
import { VisitFormWithPicker } from "@/components/admin/VisitFormWithPicker";
import { RankerTabs } from "@/components/admin/RankerTabs";

async function VisitContent() {
  const supabase = await createClient();
  const t = await getTranslations("ranker");
  const { data } = await supabase
    .from("restaurants")
    .select("id, name, cuisine_category")
    .order("name", { ascending: true });

  const restaurantList = (data ?? []) as Pick<
    Restaurant,
    "id" | "name" | "cuisine_category"
  >[];

  if (restaurantList.length === 0)
    return (
      <p className="text-[#d4c5ab] font-body italic">
        {t("noRestaurantsYet")}
      </p>
    );

  return <VisitFormWithPicker restaurants={restaurantList} />;
}

export default async function RankerPage() {
  const t = await getTranslations("ranker");
  return (
    <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 pb-32">
      <RankerTabs
        visitContent={
          <Suspense fallback={null}>
            <VisitContent />
          </Suspense>
        }
        addContent={<AddRestaurantForm />}
        rankingsContent={
          <Suspense
            fallback={
              <p className="text-[#d4c5ab] font-body italic">
                {t("loadingRankings")}
              </p>
            }
          >
            <RankingManager />
          </Suspense>
        }
      />
    </div>
  );
}
