"use client";

import {
  Circle,
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L, { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Spawnpoint } from "@/lib/spawnpoints";
import type { Tool } from "./EditorLayout";
import { useEffect } from "react";

type MapViewClientProps = {
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
  onMouseMove: (coords: { lat: number; lng: number }) => void;
};

const markerIcon = new L.Icon({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapViewClient({
  spawnpoints,
  selectedSpawnpointId,
  generatorCenter,
  mapCenter,
  mapZoom,
  mapImageUrl,
  mapBounds,
  minZoom,
  maxZoom,
  onSelectSpawnpoint,
  onMapClick,
  onMouseMove,
}: MapViewClientProps) {
  const bounds = mapBounds as LatLngBoundsExpression;

  return (
    <MapContainer
      crs={L.CRS.Simple}
      center={mapCenter}
      zoom={mapZoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      maxBounds={bounds}
      className="h-full w-full"
      zoomControl
    >
      <ImageOverlay url={mapImageUrl} bounds={bounds} />

      <MapUpdater
        center={mapCenter}
        zoom={mapZoom}
        bounds={bounds}
      />

      <MapEvents onMapClick={onMapClick} onMouseMove={onMouseMove} />

      {generatorCenter && (
        <>
          <Marker
            position={[generatorCenter.lat, generatorCenter.lng]}
            icon={markerIcon}
          >
            <Popup>Generator-Zentrum</Popup>
          </Marker>

          <Circle
            center={[generatorCenter.lat, generatorCenter.lng]}
            radius={50}
            pathOptions={{ color: "blue" }}
          />
        </>
      )}

      {spawnpoints.map((sp) => (
        <Marker
          key={sp.id}
          position={[sp.lat, sp.lng]}
          icon={markerIcon}
          eventHandlers={{
            click: () => onSelectSpawnpoint(sp.id),
          }}
        >
          <Popup>
            <div className="text-sm">
              <div><strong>ID:</strong> {sp.id}</div>
              <div><strong>Typ:</strong> {sp.type ?? "default"}</div>
              <div><strong>Y:</strong> {sp.lat.toFixed(2)}</div>
              <div><strong>X:</strong> {sp.lng.toFixed(2)}</div>
              {selectedSpawnpointId === sp.id && (
                <div className="mt-1 text-xs text-blue-600">Ausgewählt</div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function MapUpdater({
  center,
  zoom,
  bounds,
}: {
  center: [number, number];
  zoom: number;
  bounds: LatLngBoundsExpression;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
    map.fitBounds(bounds);
  }, [center, zoom, bounds, map]);

  return null;
}

function MapEvents({
  onMapClick,
  onMouseMove,
}: {
  onMapClick: (lat: number, lng: number) => void;
  onMouseMove: (coords: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
    mousemove(e) {
      onMouseMove({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}