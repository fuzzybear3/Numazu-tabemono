import { Visit } from "@/types";
import { VisitCard } from "./VisitCard";

interface Props {
  visits: Visit[];
}

export function VisitGallery({ visits }: Props) {
  if (visits.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No visits logged yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {visits.map((visit) => (
        <VisitCard key={visit.id} visit={visit} />
      ))}
    </div>
  );
}
