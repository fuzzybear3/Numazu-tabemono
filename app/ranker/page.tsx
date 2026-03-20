import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Restaurant } from "@/types";
import { AddRestaurantForm } from "@/components/admin/AddRestaurantForm";
import { RankingManager } from "@/components/admin/RankingManager";
import { VisitFormWithPicker } from "@/components/admin/VisitFormWithPicker";
import { BottomNav } from "@/components/BottomNav";

async function VisitSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("restaurants")
    .select("id, name, cuisine_category")
    .order("name", { ascending: true });

  const restaurantList = (data ?? []) as Pick<
    Restaurant,
    "id" | "name" | "cuisine_category"
  >[];

  if (restaurantList.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="relative">
        <div className="absolute -top-8 -left-4 opacity-[0.07] select-none pointer-events-none">
          <span className="font-headline text-8xl text-[#d4c5ab]">記録</span>
        </div>
        <h2 className="font-headline text-3xl md:text-4xl text-[#ffe2ab] mb-1">
          Log a Visit
        </h2>
        <p className="font-headline italic text-[#d4c5ab] text-base">
          訪問を記録する
        </p>
      </div>
      <VisitFormWithPicker restaurants={restaurantList} />
    </section>
  );
}

export default function RankerPage() {
  return (
    <>
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 pb-32 space-y-16">
        <Suspense fallback={null}>
          <VisitSection />
        </Suspense>

        <section className="space-y-6">
          <div className="border-t border-[#504532]/10 pt-8">
            <h2 className="font-headline text-2xl text-[#e5e2e1] mb-1">
              Add Restaurant
            </h2>
            <p className="font-body text-sm text-[#9c8f78] italic mb-6">
              Register a new establishment.
            </p>
          </div>
          <AddRestaurantForm />
        </section>

        <section className="space-y-6">
          <div className="border-t border-[#504532]/10 pt-8">
            <h2 className="font-headline text-2xl text-[#e5e2e1] mb-1">
              Rank Hierarchy
            </h2>
            <p className="font-body text-sm text-[#d4c5ab] italic mb-6">
              Drag to reorder, then save.
            </p>
          </div>
          <Suspense
            fallback={
              <p className="text-[#d4c5ab] font-body italic">
                Loading rankings...
              </p>
            }
          >
            <RankingManager />
          </Suspense>
        </section>
      </div>

      <BottomNav activeTab="journal" />
    </>
  );
}
