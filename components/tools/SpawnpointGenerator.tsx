"use client";

import { useMemo, useRef, useState } from "react";

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
};

const maps: MapConfig[] = [
  {
    key: "chernarus",
    name: "Chernarus",
    image: "/maps/chernarus.jpg",
    worldSize: 15360,
    description: "Große klassische DayZ-Map mit Küste, Städten und Militärzonen.",
  },
  {
    key: "livonia",
    name: "Livonia",
    image: "/maps/livonia.jpg",
    worldSize: 12800,
    description: "Waldreiche Map mit Flüssen, Dörfern und dichter Vegetation.",
  },
  {
    key: "sakhal",
    name: "Sakhal",
    image: "/maps/sakhal.jpg",
    worldSize: 12800,
    description: "Schneereiche Map für härtere Survival-Setups und neue Spawn-Routen.",
  },
];

function toDayzCoordinate(percent: number, worldSize: number) {
  return Math.round((percent / 100) * worldSize);
}

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

export default function SpawnpointGenerator() {
  const [activeMap, setActiveMap] = useState<MapKey>("chernarus");
  const [points, setPoints] = useState<SpawnPoint[]>([]);
  const [zoom, setZoom] = useState(1.4);
  const [draftLabel, setDraftLabel] = useState("Spawn");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMoved, setDragMoved] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  const stageRef = useRef<HTMLDivElement | null>(null);

  const currentMap = maps.find((m) => m.key === activeMap) ?? maps[0];
  const filteredPoints = points.filter((point) => point.map === activeMap);

  const exportData = useMemo(() => {
    return filteredPoints.map((point, index) => ({
      id: point.id,
      name: point.label || `Spawn ${index + 1}`,
      map: point.map,
      percentX: Number(point.x.toFixed(2)),
      percentY: Number(point.y.toFixed(2)),
      worldX: toDayzCoordinate(point.x, currentMap.worldSize),
      worldZ: toDayzCoordinate(point.y, currentMap.worldSize),
    }));
  }, [filteredPoints, currentMap.worldSize]);

  const hoverWorld = useMemo(() => {
    if (!hover) return null;
    return {
      worldX: toDayzCoordinate(hover.x, currentMap.worldSize),
      worldZ: toDayzCoordinate(hover.y, currentMap.worldSize),
    };
  }, [hover, currentMap.worldSize]);

  const resetView = () => {
    setZoom(1.4);
    setPosition({ x: 0, y: 0 });
  };

  const handleMapChange = (mapKey: MapKey) => {
    setActiveMap(mapKey);
    setZoom(1.4);
    setPosition({ x: 0, y: 0 });
    setHover(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragMoved(false);
    setStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const localX = (e.clientX - rect.left - position.x) / zoom;
    const localY = (e.clientY - rect.top - position.y) / zoom;

    const percentX = clamp((localX / rect.width) * 100, 0, 100);
    const percentY = clamp((localY / rect.height) * 100, 0, 100);

    setHover({ x: percentX, y: percentY });

    if (!isDragging) return;

    setDragMoved(true);
    setPosition({
      x: e.clientX - start.x,
      y: e.clientY - start.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setDragMoved(false), 0);
  };

  const handleStageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (dragMoved) return;

    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const localX = (event.clientX - rect.left - position.x) / zoom;
    const localY = (event.clientY - rect.top - position.y) / zoom;

    const percentX = (localX / rect.width) * 100;
    const percentY = (localY / rect.height) * 100;

    if (percentX < 0 || percentX > 100 || percentY < 0 || percentY > 100) return;

    const nextPoint: SpawnPoint = {
      id: crypto.randomUUID(),
      x: percentX,
      y: percentY,
      label: `${draftLabel} ${filteredPoints.length + 1}`,
      map: activeMap,
    };

    setPoints((prev) => [...prev, nextPoint]);
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
        <div className="badge">Step Mod!Z · Spawnpoint Generator Pro</div>
        <div className="space" />
        <h2 className="h2">Spawnpoints mit Vollbreite, Grid und Live-Koordinaten</h2>
        <p className="muted">
          Zoome tief in die Karte hinein, verschiebe sie per Drag, nutze das Grid-Overlay
          und setze präzise Spawnpunkte mit Live-Koordinaten.
        </p>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" onClick={exportJson}>
            JSON exportieren
          </button>
          <button className="btn btn-secondary" onClick={clearCurrentMap}>
            Aktive Map leeren
          </button>
          <button className="btn btn-secondary" onClick={resetView}>
            Ansicht zurücksetzen
          </button>
        </div>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "280px minmax(0,1fr) 340px",
          alignItems: "start",
        }}
      >
        <aside className="card" style={{ padding: 20 }}>
          <h3 className="h3">Maps</h3>
          <div className="space" />

          <div className="stack">
            {maps.map((map) => {
              const isActive = map.key === activeMap;
              return (
                <button
                  key={map.key}
                  onClick={() => handleMapChange(map.key)}
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

            <div>
              <label className="label">Zoom</label>
              <input
                type="range"
                min={1}
                max={6}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <div className="small muted" style={{ marginTop: 6 }}>
                Aktuell: {zoom.toFixed(1)}x
              </div>
            </div>

            <div className="row">
              <button
                className="btn btn-secondary"
                onClick={() => setShowGrid((v) => !v)}
              >
                {showGrid ? "Grid ausblenden" : "Grid einblenden"}
              </button>
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div className="small muted">Live Mausposition</div>
              <div style={{ marginTop: 10, lineHeight: 1.7 }}>
                <div className="small">
                  % X / Y:{" "}
                  <strong>
                    {hover ? `${hover.x.toFixed(2)} / ${hover.y.toFixed(2)}` : "- / -"}
                  </strong>
                </div>
                <div className="small" style={{ marginTop: 6 }}>
                  World X / Z:{" "}
                  <strong>
                    {hoverWorld ? `${hoverWorld.worldX} / ${hoverWorld.worldZ}` : "- / -"}
                  </strong>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div className="small muted">Hinweise</div>
              <div className="small" style={{ marginTop: 8, lineHeight: 1.6 }}>
                Linke Maustaste gedrückt halten = Karte verschieben
                <br />
                Klick ohne Ziehen = Spawnpunkt setzen
                <br />
                Hohes Zoom = mehr Präzision
              </div>
            </div>
          </div>
        </aside>

        <section className="card" style={{ padding: 20 }}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 className="h3">{currentMap.name} Map Stage</h3>
              <div className="small muted" style={{ marginTop: 6 }}>
                Vollbreite, sauberes Seitenverhältnis und Grid-Overlay.
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
              height: "78vh",
              minHeight: 700,
              maxHeight: 980,
              position: "relative",
            }}
          >
            <div
              ref={stageRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                handleMouseUp();
                setHover(null);
              }}
              onClick={handleStageClick}
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                cursor: isDragging ? "grabbing" : "grab",
                position: "relative",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${currentMap.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
              />

              {showGrid && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    opacity: 0.28,
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)
                    `,
                    backgroundSize: `${80 * zoom}px ${80 * zoom}px`,
                    backgroundPosition: `${position.x}px ${position.y}px`,
                  }}
                />
              )}

              {hover && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      left: `${hover.x}%`,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      background: "rgba(72,208,95,.6)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: `${hover.y}%`,
                      left: 0,
                      right: 0,
                      height: 1,
                      background: "rgba(72,208,95,.6)",
                      pointerEvents: "none",
                    }}
                  />
                </>
              )}

              {filteredPoints.map((point, index) => (
                <button
                  key={point.id}
                  title={`${point.label} (${point.x.toFixed(2)}%, ${point.y.toFixed(2)}%)`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removePoint(point.id);
                  }}
                  className="map-point"
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    color: "#fff",
                    fontSize: 13,
                    zIndex: 10,
                  }}
                >
                  {index + 1}
                </button>
              ))}

              {hover && (
                <div
                  className="card"
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                    padding: "10px 12px",
                    background: "rgba(0,0,0,.68)",
                    zIndex: 20,
                    pointerEvents: "none",
                  }}
                >
                  <div className="small muted">
                    % {hover.x.toFixed(2)} / {hover.y.toFixed(2)}
                  </div>
                  <div className="small" style={{ marginTop: 4 }}>
                    {hoverWorld?.worldX} / {hoverWorld?.worldZ}
                  </div>
                </div>
              )}

              {!filteredPoints.length && (
                <div
                  className="card"
                  style={{
                    position: "absolute",
                    left: 24,
                    right: 24,
                    bottom: 24,
                    padding: 14,
                    borderStyle: "dashed",
                    background: "rgba(0,0,0,.45)",
                    zIndex: 20,
                  }}
                >
                  <span className="small muted">
                    Noch keine Punkte gesetzt. Zoome hinein und klicke auf die Karte.
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

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
                        {point.x.toFixed(2)} / {point.y.toFixed(2)}
                      </div>
                    </div>

                    <div className="card" style={{ padding: 12 }}>
                      <div className="small muted">World X / Z</div>
                      <div style={{ marginTop: 6, fontWeight: 700 }}>
                        {toDayzCoordinate(point.x, currentMap.worldSize)} /{" "}
                        {toDayzCoordinate(point.y, currentMap.worldSize)}
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