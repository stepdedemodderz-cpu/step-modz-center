"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";

type MapKey = "chernarus" | "livonia" | "sakhal";

type SpawnPoint = {
  id: string;
  x: number;
  y: number;
  label: string;
  map: MapKey;
};

type MapConfig = {
  key: MapKey;
  name: string;
  image: string;
  worldSize: number;
  description: string;
  initialFocus: {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
  };
};

const maps: MapConfig[] = [
  {
    key: "chernarus",
    name: "Chernarus",
    image: "/maps/chernarus.jpg",
    worldSize: 15360,
    description: "Große klassische DayZ-Map mit Küste, Städten und Militärzonen.",
    initialFocus: {
      xMin: 0.18,
      yMin: 0.18,
      xMax: 0.88,
      yMax: 0.78,
    },
  },
  {
    key: "livonia",
    name: "Livonia",
    image: "/maps/livonia.jpg",
    worldSize: 12800,
    description: "Waldreiche Map mit Flüssen, Dörfern und dichter Vegetation.",
    initialFocus: {
      xMin: 0.15,
      yMin: 0.15,
      xMax: 0.88,
      yMax: 0.82,
    },
  },
  {
    key: "sakhal",
    name: "Sakhal",
    image: "/maps/sakhal.jpg",
    worldSize: 12800,
    description: "Schneereiche Map für härtere Survival-Setups und neue Spawn-Routen.",
    initialFocus: {
      xMin: 0.14,
      yMin: 0.14,
      xMax: 0.86,
      yMax: 0.82,
    },
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function downloadFile(filename: string, content: string, mime = "application/json") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function markerIcon(index: number) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:32px;
        height:32px;
        border-radius:999px;
        background:#ec2027;
        color:#fff;
        border:2px solid #fff;
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:800;
        font-size:13px;
        box-shadow:0 0 0 8px rgba(236,32,39,.18);
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function FocusBounds({
  width,
  height,
  focus,
}: {
  width: number;
  height: number;
  focus: MapConfig["initialFocus"];
}) {
  const map = useMap();

  useEffect(() => {
    const bounds: L.LatLngBoundsExpression = [
      [height * focus.yMin, width * focus.xMin],
      [height * focus.yMax, width * focus.xMax],
    ];

    map.fitBounds(bounds, { padding: [24, 24], animate: false });
  }, [map, width, height, focus]);

  return null;
}

function GridOverlay({
  width,
  height,
  divisions = 10,
}: {
  width: number;
  height: number;
  divisions?: number;
}) {
  const lines = [];

  for (let i = 1; i < divisions; i++) {
    const x = (width / divisions) * i;
    const y = (height / divisions) * i;

    lines.push(
      <div
        key={`v-${i}`}
        style={{
          position: "absolute",
          left: `${(x / width) * 100}%`,
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(255,255,255,.14)",
          pointerEvents: "none",
        }}
      />
    );

    lines.push(
      <div
        key={`h-${i}`}
        style={{
          position: "absolute",
          top: `${(y / height) * 100}%`,
          left: 0,
          right: 0,
          height: 1,
          background: "rgba(255,255,255,.14)",
          pointerEvents: "none",
        }}
      />
    );
  }

  return <>{lines}</>;
}

function MapEventsHandler({
  width,
  height,
  onAddPoint,
  onHover,
}: {
  width: number;
  height: number;
  onAddPoint: (x: number, y: number) => void;
  onHover: (x: number | null, y: number | null) => void;
}) {
  useMapEvents({
    click(e) {
      const x = clamp(e.latlng.lng, 0, width);
      const y = clamp(e.latlng.lat, 0, height);
      onAddPoint(x, y);
    },
    mousemove(e) {
      const x = clamp(e.latlng.lng, 0, width);
      const y = clamp(e.latlng.lat, 0, height);
      onHover(x, y);
    },
    mouseout() {
      onHover(null, null);
    },
  });

  return null;
}

export default function SpawnpointGenerator() {
  const [activeMap, setActiveMap] = useState<MapKey>("chernarus");
  const [points, setPoints] = useState<SpawnPoint[]>([]);
  const [draftLabel, setDraftLabel] = useState("Spawn");
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, ready: false });

  const currentMap = maps.find((m) => m.key === activeMap) ?? maps[0];
  const filteredPoints = points.filter((point) => point.map === activeMap);

  useEffect(() => {
    setImageSize({ width: 0, height: 0, ready: false });

    const img = new window.Image();
    img.onload = () => {
      setImageSize({
        width: img.naturalWidth,
        height: img.naturalHeight,
        ready: true,
      });
    };
    img.src = currentMap.image;
  }, [currentMap.image]);

  const bounds = useMemo(() => {
    if (!imageSize.ready) return [[0, 0], [1000, 1000]] as L.LatLngBoundsExpression;
    return [
      [0, 0],
      [imageSize.height, imageSize.width],
    ] as L.LatLngBoundsExpression;
  }, [imageSize]);

  const exportData = useMemo(() => {
    if (!imageSize.ready) return [];

    return filteredPoints.map((point, index) => ({
      id: point.id,
      name: point.label || `Spawn ${index + 1}`,
      map: point.map,
      worldX: Math.round((point.x / imageSize.width) * currentMap.worldSize),
      worldZ: Math.round((point.y / imageSize.height) * currentMap.worldSize),
      percentX: Number(((point.x / imageSize.width) * 100).toFixed(2)),
      percentY: Number(((point.y / imageSize.height) * 100).toFixed(2)),
    }));
  }, [filteredPoints, currentMap.worldSize, imageSize]);

  const hoverWorld = useMemo(() => {
    if (!hover || !imageSize.ready) return null;

    return {
      worldX: Math.round((hover.x / imageSize.width) * currentMap.worldSize),
      worldZ: Math.round((hover.y / imageSize.height) * currentMap.worldSize),
      percentX: ((hover.x / imageSize.width) * 100).toFixed(2),
      percentY: ((hover.y / imageSize.height) * 100).toFixed(2),
    };
  }, [hover, currentMap.worldSize, imageSize]);

  const addPoint = (x: number, y: number) => {
    const nextPoint: SpawnPoint = {
      id: crypto.randomUUID(),
      x,
      y,
      label: `${draftLabel} ${filteredPoints.length + 1}`,
      map: activeMap,
    };

    setPoints((prev) => [...prev, nextPoint]);
  };

  const updatePoint = (id: string, x: number, y: number) => {
    setPoints((prev) =>
      prev.map((point) =>
        point.id === id
          ? {
              ...point,
              x: clamp(x, 0, imageSize.width),
              y: clamp(y, 0, imageSize.height),
            }
          : point
      )
    );
  };

  const clearCurrentMap = () => {
    setPoints((prev) => prev.filter((point) => point.map !== activeMap));
  };

  const removePoint = (id: string) => {
    setPoints((prev) => prev.filter((point) => point.id !== id));
  };

  const exportJson = () => {
    downloadFile(
      `${activeMap}-spawnpoints.json`,
      JSON.stringify(
        {
          server: "Step Mod!Z",
          map: activeMap,
          worldSize: currentMap.worldSize,
          imageWidth: imageSize.width,
          imageHeight: imageSize.height,
          points: exportData,
        },
        null,
        2
      )
    );
  };

  return (
    <div className="stack">
      <div className="card hero-card">
        <div className="badge">Step Mod!Z · Spawnpoint Generator Leaflet</div>
        <div className="space" />
        <h2 className="h2">Exakte Spawnpoints mit echtem Karten-Zoom</h2>
        <p className="muted">
          Karte startet direkt näher dran und lässt sich sauber zoomen und verschieben.
        </p>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={exportJson}>
            JSON exportieren
          </button>
          <button className="btn btn-secondary" onClick={clearCurrentMap}>
            Aktive Map leeren
          </button>
        </div>
      </div>

      <section className="card" style={{ padding: 20 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 className="h3">{currentMap.name} Map Stage</h3>
            <div className="small muted" style={{ marginTop: 6 }}>
              Startet direkt näher in einem sinnvollen Kartenbereich.
            </div>
          </div>
          <div className="badge small">{currentMap.image}</div>
        </div>

        <div className="space" />

        <div
          style={{
            overflow: "hidden",
            borderRadius: 24,
            border: "1px solid var(--line)",
            background: "#0b1118",
            width: "100%",
            height: "88vh",
            minHeight: 760,
            maxHeight: 1200,
            position: "relative",
          }}
        >
          {imageSize.ready ? (
            <>
              <MapContainer
                key={`${activeMap}-${imageSize.width}-${imageSize.height}`}
                crs={L.CRS.Simple}
                bounds={bounds}
                maxBounds={bounds}
                maxBoundsViscosity={1}
                zoom={0}
                minZoom={-1.5}
                maxZoom={4}
                zoomSnap={0.25}
                zoomDelta={0.5}
                scrollWheelZoom
                doubleClickZoom
                attributionControl={false}
                style={{ width: "100%", height: "100%", background: "#0b1118" }}
              >
                <FocusBounds
                  width={imageSize.width}
                  height={imageSize.height}
                  focus={currentMap.initialFocus}
                />

                <ImageOverlay url={currentMap.image} bounds={bounds} />

                <MapEventsHandler
                  width={imageSize.width}
                  height={imageSize.height}
                  onAddPoint={addPoint}
                  onHover={(x, y) => {
                    if (x === null || y === null) {
                      setHover(null);
                      return;
                    }
                    setHover({ x, y });
                  }}
                />

                {filteredPoints.map((point, index) => (
                  <Marker
                    key={point.id}
                    position={[point.y, point.x]}
                    icon={markerIcon(index)}
                    draggable
                    eventHandlers={{
                      dragend: (e) => {
                        const marker = e.target;
                        const latlng = marker.getLatLng();
                        updatePoint(point.id, latlng.lng, latlng.lat);
                      },
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -18]} permanent>
                      {point.label}
                    </Tooltip>
                    <Popup>
                      <div style={{ minWidth: 180 }}>
                        <strong>{point.label}</strong>
                        <div style={{ marginTop: 8, fontSize: 13 }}>
                          World X / Z:{" "}
                          {Math.round((point.x / imageSize.width) * currentMap.worldSize)} /{" "}
                          {Math.round((point.y / imageSize.height) * currentMap.worldSize)}
                        </div>
                        <button
                          style={{
                            marginTop: 10,
                            border: "1px solid rgba(255,255,255,.12)",
                            background: "#111620",
                            color: "#fff",
                            borderRadius: 10,
                            padding: "8px 10px",
                            cursor: "pointer",
                          }}
                          onClick={() => removePoint(point.id)}
                        >
                          Löschen
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {showGrid && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 400,
                  }}
                >
                  <GridOverlay width={imageSize.width} height={imageSize.height} />
                </div>
              )}

              {hoverWorld && (
                <div
                  className="card"
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                    padding: "10px 12px",
                    background: "rgba(0,0,0,.72)",
                    zIndex: 999,
                    pointerEvents: "none",
                  }}
                >
                  <div className="small muted">
                    % {hoverWorld.percentX} / {hoverWorld.percentY}
                  </div>
                  <div className="small" style={{ marginTop: 4 }}>
                    {hoverWorld.worldX} / {hoverWorld.worldZ}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                display: "grid",
                placeItems: "center",
                width: "100%",
                height: "100%",
                color: "var(--muted)",
              }}
            >
              Kartenbild wird geladen...
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <aside className="card" style={{ padding: 20 }}>
          <h3 className="h3">Maps</h3>
          <div className="space" />

          <div className="stack">
            {maps.map((map) => {
              const isActive = map.key === activeMap;
              return (
                <button
                  key={map.key}
                  onClick={() => setActiveMap(map.key)}
                  className="tool-link"
                  style={{
                    textAlign: "left",
                    background: isActive ? "rgba(72,208,95,.10)" : "rgba(255,255,255,.03)",
                    borderColor: isActive ? "rgba(72,208,95,.25)" : "rgba(255,255,255,.08)",
                    color: "var(--text)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <strong>{map.name}</strong>
                    <span className="badge small">{map.worldSize}</span>
                  </div>
                  <div className="small muted" style={{ marginTop: 8 }}>
                    {map.description}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space" />

          <div className="stack">
            <div>
              <label className="label">Basisname für neue Punkte</label>
              <input
                className="input"
                value={draftLabel}
                onChange={(e) => setDraftLabel(e.target.value)}
                placeholder="Spawn"
              />
            </div>

            <div className="row">
              <button className="btn btn-secondary" onClick={() => setShowGrid((v) => !v)}>
                {showGrid ? "Grid ausblenden" : "Grid einblenden"}
              </button>
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div className="small muted">Hinweise</div>
              <div className="small" style={{ marginTop: 8, lineHeight: 1.6 }}>
                Scrollrad = zoomen
                <br />
                Linke Maustaste = verschieben
                <br />
                Klick = Punkt setzen
                <br />
                Marker ziehen = Position ändern
              </div>
            </div>
          </div>
        </aside>

        <aside className="card" style={{ padding: 20 }}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <h3 className="h3">Spawnpunkt-Liste</h3>
            <span className="badge small">{filteredPoints.length} Einträge</span>
          </div>

          <div className="space" />

          <div className="stack">
            {filteredPoints.length ? (
              filteredPoints.map((point, index) => (
                <div key={point.id} className="card" style={{ padding: 16 }}>
                  <div className="row" style={{ justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <strong>{point.label}</strong>
                      <div className="small muted" style={{ marginTop: 6 }}>
                        #{index + 1} · {currentMap.name}
                      </div>
                    </div>
                    <button className="btn btn-secondary" onClick={() => removePoint(point.id)}>
                      Löschen
                    </button>
                  </div>

                  <div className="grid grid-2" style={{ marginTop: 16 }}>
                    <div className="card" style={{ padding: 12 }}>
                      <div className="small muted">% X / Y</div>
                      <div style={{ marginTop: 6, fontWeight: 700 }}>
                        {imageSize.ready
                          ? `${((point.x / imageSize.width) * 100).toFixed(2)} / ${(
                              (point.y / imageSize.height) *
                              100
                            ).toFixed(2)}`
                          : "- / -"}
                      </div>
                    </div>

                    <div className="card" style={{ padding: 12 }}>
                      <div className="small muted">World X / Z</div>
                      <div style={{ marginTop: 6, fontWeight: 700 }}>
                        {imageSize.ready
                          ? `${Math.round((point.x / imageSize.width) * currentMap.worldSize)} / ${Math.round(
                              (point.y / imageSize.height) * currentMap.worldSize
                            )}`
                          : "- / -"}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ padding: 16, borderStyle: "dashed" }}>
                <span className="small muted">Noch keine Spawnpunkte vorhanden.</span>
              </div>
            )}
          </div>

          <div className="space" />

          <h3 className="small muted" style={{ letterSpacing: ".24em", textTransform: "uppercase" }}>
            Export Preview
          </h3>

          <pre className="output" style={{ maxHeight: 260, overflow: "auto", marginTop: 12 }}>
{JSON.stringify(exportData, null, 2)}
          </pre>
        </aside>
      </div>
    </div>
  );
}