"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { RankedRestaurant } from "@/types";

const CENTER: [number, number] = [35.1, 138.8691]; // Numazu, Japan

function makePin(rank: number) {
  return divIcon({
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:#18181b;color:#fafafa;
      display:flex;align-items:center;justify-content:center;
      font-weight:700;font-size:13px;font-family:sans-serif;
      border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.4);
      cursor:pointer;
    ">${rank}</div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

interface Props {
  restaurants: RankedRestaurant[];
  onSelect: (restaurant: RankedRestaurant) => void;
}

export default function LeafletMap({ restaurants, onSelect }: Props) {
  return (
    <MapContainer
      center={CENTER}
      zoom={13}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {restaurants.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={makePin(r.rank_position)}
          eventHandlers={{ click: () => onSelect(r) }}
          title={r.name}
        />
      ))}
    </MapContainer>
  );
}
