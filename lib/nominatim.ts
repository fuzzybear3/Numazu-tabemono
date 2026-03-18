export interface NominatimResult {
  place_id: number;
  osm_id: number;
  osm_type: string; // "node" | "way" | "relation"
  display_name: string;
  lat: string;
  lon: string;
}

export function nominatimPlaceKey(r: NominatimResult): string {
  return `${r.osm_type}/${r.osm_id}`;
}
