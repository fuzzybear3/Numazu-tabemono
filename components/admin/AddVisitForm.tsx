"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createVisit } from "@/actions/visits";
import { uploadFoodPhoto } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CUISINE_CHIPS: Record<'ramen' | 'tonkatsu', string[]> = {
  ramen:    ["Shoyu Ramen", "Miso Ramen", "Shio Ramen", "Tonkotsu Ramen", "Tantanmen", "Tsukemen"],
  tonkatsu: ["Tonkatsu"],
};

interface Props {
  restaurantId:    string;
  cuisineCategory?: 'ramen' | 'tonkatsu' | 'sushi' | 'other';
}

export function AddVisitForm({ restaurantId, cuisineCategory = "other" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const chips = (cuisineCategory === 'ramen' || cuisineCategory === 'tonkatsu') ? CUISINE_CHIPS[cuisineCategory] : null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (chips && !selectedItem) {
      setError("Please select a ramen type.");
      return;
    }

    startTransition(async () => {
      try {
        if (file) {
          setUploading(true);
          const url = await uploadFoodPhoto(file);
          setUploading(false);
          formData.set("food_photo_url", url);
        }

        formData.set("restaurant_id", restaurantId);
        await createVisit(formData);
        setSuccess(true);
        setSelectedItem(null);
        form.reset();
        router.refresh();
      } catch (err) {
        setUploading(false);
        setError(err instanceof Error ? err.message : "Failed to log visit");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="visited_at">Visit date</Label>
        <Input
          id="visited_at"
          name="visited_at"
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <div className="grid gap-1.5">
        <Label>Menu item {chips ? <span className="text-destructive">*</span> : "(optional)"}</Label>
        {chips ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setSelectedItem(selectedItem === chip ? null : chip)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  selectedItem === chip
                    ? "border-foreground bg-foreground text-background"
                    : "border-input bg-background hover:bg-muted"
                }`}
              >
                {chip}
              </button>
            ))}
            <input type="hidden" name="menu_item" value={selectedItem ?? ""} />
          </div>
        ) : (
          <Input
            id="menu_item"
            name="menu_item"
            placeholder="e.g. Toro nigiri"
          />
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input id="notes" name="notes" placeholder="How was it?" />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="food_photo">Food photo (optional)</Label>
        <Input id="food_photo" type="file" accept="image/*" />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">Visit logged successfully!</p>
      )}

      <Button type="submit" disabled={isPending || uploading}>
        {uploading ? "Uploading photo..." : isPending ? "Saving..." : "Log visit"}
      </Button>
    </form>
  );
}
