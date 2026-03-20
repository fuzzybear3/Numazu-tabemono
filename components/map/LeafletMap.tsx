"use client";

import { useEffect, useRef } from "react";
import type { Map, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { RankedRestaurant } from "@/types";

const CENTER: [number, number] = [35.1, 138.8691];

interface Props {
  restaurants: RankedRestaurant[];
  onSelect: (restaurant: RankedRestaurant) => void;
}

export default function LeafletMap({ restaurants, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  // Initialize map once on mount, clean up on unmount
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Leaflet is client-only; importing here is safe since ssr:false
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");

    const map = L.map(containerRef.current, { center: CENTER, zoom: 13 });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
  }, []);

  // Sync markers whenever restaurants or onSelect changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet") as typeof import("leaflet");

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    restaurants.forEach((r) => {
      const icon = L.divIcon({
        html: `<div style="
          width:32px;height:32px;border-radius:50%;
          background:#18181b;color:#fafafa;
          display:flex;align-items:center;justify-content:center;
          font-weight:700;font-size:13px;font-family:sans-serif;
          border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4);
          cursor:pointer;
        ">${r.rank_position}</div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([r.lat, r.lng], { icon, title: r.name }).on(
        "click",
        () => onSelect(r),
      );
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [restaurants, onSelect]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
