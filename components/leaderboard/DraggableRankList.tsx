"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderRankings } from "@/actions/rankings";
import { RankedRestaurant } from "@/types";
import { Button } from "@/components/ui/button";

interface SortableItemProps {
  restaurant: RankedRestaurant;
  index: number;
}

function SortableItem({ restaurant, index }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: restaurant.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <span className="text-muted-foreground font-mono w-6 text-center">
        {index + 1}
      </span>
      <span className="text-muted-foreground">⠿</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{restaurant.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {restaurant.cuisine_type ?? restaurant.address}
        </p>
      </div>
    </div>
  );
}

interface Props {
  initialRestaurants: RankedRestaurant[];
}

export function DraggableRankList({ initialRestaurants }: Props) {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setRestaurants((items) => {
      const oldIndex = items.findIndex((r) => r.id === active.id);
      const newIndex = items.findIndex((r) => r.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await reorderRankings(restaurants.map((r) => r.id));
      setSaved(true);
    } catch (e) {
      alert("Failed to save order. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={restaurants.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {restaurants.map((restaurant, index) => (
              <SortableItem
                key={restaurant.id}
                restaurant={restaurant}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : saved ? "Saved!" : "Save order"}
      </Button>
    </div>
  );
}
