import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Restaurant } from "@/types";
import { AddRestaurantForm } from "@/components/admin/AddRestaurantForm";
import { RankingManager } from "@/components/admin/RankingManager";
import { VisitFormWithPicker } from "@/components/admin/VisitFormWithPicker";

async function VisitSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("restaurants")
    .select("id, name, cuisine_category")
    .order("name", { ascending: true });

  const restaurantList = (data ?? []) as Pick<Restaurant, "id" | "name" | "cuisine_category">[];

  if (restaurantList.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Log a visit</h2>
      <VisitFormWithPicker restaurants={restaurantList} />
    </section>
  );
}

export default function AdminPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-12">
      <section>
        <h2 className="text-xl font-semibold mb-4">Add restaurant</h2>
        <AddRestaurantForm />
      </section>

      <Suspense fallback={null}>
        <VisitSection />
      </Suspense>

      <section>
        <h2 className="text-xl font-semibold mb-4">Manage rankings</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Drag to reorder, then click "Save order".
        </p>
        <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
          <RankingManager />
        </Suspense>
      </section>
    </div>
  );
}
