"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { Spawnpoint } from "@/lib/spawnpoints";
import type { Tool } from "./EditorLayout";

type MapPanelProps = {
  activeTool: Tool;
  spawnpoints: Spawnpoint[];
  selectedSpawnpointId: string | null;
  generatorCenter: { lat: number; lng: number } | null;
  mapCenter: [number, number];
  mapZoom: number;
  mapImageUrl: string;
  mapBounds: [[number, number], [number, number]];
  minZoom: number;
  maxZoom: number;
  onSelectSpawnpoint: (id: string | null) => void;
  onMapClick: (lat: number, lng: number) => void;
};

const LeafletMap = dynamic(() => import("./MapViewClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-sm text-zinc-400">
      Karte wird geladen...
    </div>
  ),
});

export default function MapPanel(props: MapPanelProps) {
  const [mousePosition, setMousePosition] = useState<{ lat: number; lng: number } | null>(null);

  const coordsText = useMemo(() => {
    if (!mousePosition) return "X: -, Y: -";
    return `X: ${mousePosition.lng.toFixed(2)}, Y: ${mousePosition.lat.toFixed(2)}`;
  }, [mousePosition]);

  const toolLabel = props.activeTool === "generate" ? "Generate" : "Place";

  return (
    <main className="relative h-full w-full bg-zinc-950">
      <LeafletMap {...props} onMouseMove={setMousePosition} />

      <div className="absolute left-4 top-4 rounded-xl bg-black/70 px-3 py-2 text-xs text-zinc-200 backdrop-blur">
        Tool: <span className="font-semibold">{toolLabel}</span>
      </div>

      <div className="absolute bottom-4 left-4 rounded-xl bg-black/70 px-3 py-2 text-xs text-zinc-200 backdrop-blur">
        {coordsText}
      </div>

      <div className="absolute bottom-4 right-4 rounded-xl bg-black/70 px-3 py-2 text-xs text-zinc-200 backdrop-blur">
        Spawnpoints: <span className="font-semibold">{props.spawnpoints.length}</span>
      </div>
    </main>
  );
}