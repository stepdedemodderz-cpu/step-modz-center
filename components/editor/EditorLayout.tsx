"use client";

import { useEffect, useMemo, useState } from "react";
import Topbar from "./Topbar";
import ToolSidebar from "./ToolSidebar";
import MapPanel from "./MapPanel";
import MapSelectorCards from "./MapSelectorCards";
import SpawnpointList from "./SpawnpointList";
import ExportPreview from "./ExportPreview";
import GeneratorPanel from "./GeneratorPanel";
import {
  generateSpawnpoints,
  type GeneratorSettings,
  type Spawnpoint,
} from "@/lib/spawnpoints";
import { DAYZ_MAPS, type DayzMapKey } from "@/lib/maps";

export type Tool = "place" | "generate";

type MapData = {
  spawnpoints: Spawnpoint[];
  generatorCenter: { lat: number; lng: number } | null;
};

type MapDataState = Record<DayzMapKey, MapData>;

type PersistedEditorState = {
  selectedMap: DayzMapKey;
  generatorSettings: GeneratorSettings;
  mapData: MapDataState;
};

const STORAGE_KEY = "stepmodz-editor-v3";

const EMPTY_MAP_DATA: MapDataState = {
  chernarus: { spawnpoints: [], generatorCenter: null },
  livonia: { spawnpoints: [], generatorCenter: null },
  sakhal: { spawnpoints: [], generatorCenter: null },
};

const DEFAULT_GENERATOR_SETTINGS: GeneratorSettings = {
  count: 10,
  radius: 50,
  minDistance: 5,
  seed: "stepmodz",
};

export default function EditorLayout() {
  const [activeTool, setActiveTool] = useState<Tool>("place");
  const [selectedMap, setSelectedMap] = useState<DayzMapKey>("chernarus");
  const [selectedSpawnpointId, setSelectedSpawnpointId] = useState<string | null>(null);
  const [mapData, setMapData] = useState<MapDataState>(EMPTY_MAP_DATA);
  const [generatorSettings, setGeneratorSettings] =
    useState<GeneratorSettings>(DEFAULT_GENERATOR_SETTINGS);
  const [hasLoaded, setHasLoaded] = useState(false);

  const currentMap = DAYZ_MAPS[selectedMap];
  const currentMapData = mapData[selectedMap];
  const spawnpoints = currentMapData.spawnpoints;
  const generatorCenter = currentMapData.generatorCenter;

  const selectedSpawnpoint = useMemo(() => {
    return spawnpoints.find((sp) => sp.id === selectedSpawnpointId) ?? null;
  }, [spawnpoints, selectedSpawnpointId]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHasLoaded(true);
        return;
      }

      const parsed = JSON.parse(raw) as Partial<PersistedEditorState>;

      if (parsed.selectedMap && DAYZ_MAPS[parsed.selectedMap]) {
        setSelectedMap(parsed.selectedMap);
      }

      if (parsed.generatorSettings) {
        setGeneratorSettings({
          count: parsed.generatorSettings.count ?? DEFAULT_GENERATOR_SETTINGS.count,
          radius: parsed.generatorSettings.radius ?? DEFAULT_GENERATOR_SETTINGS.radius,
          minDistance:
            parsed.generatorSettings.minDistance ?? DEFAULT_GENERATOR_SETTINGS.minDistance,
          seed: parsed.generatorSettings.seed ?? DEFAULT_GENERATOR_SETTINGS.seed,
        });
      }

      if (parsed.mapData) {
        setMapData({
          chernarus: {
            spawnpoints: parsed.mapData.chernarus?.spawnpoints ?? [],
            generatorCenter: parsed.mapData.chernarus?.generatorCenter ?? null,
          },
          livonia: {
            spawnpoints: parsed.mapData.livonia?.spawnpoints ?? [],
            generatorCenter: parsed.mapData.livonia?.generatorCenter ?? null,
          },
          sakhal: {
            spawnpoints: parsed.mapData.sakhal?.spawnpoints ?? [],
            generatorCenter: parsed.mapData.sakhal?.generatorCenter ?? null,
          },
        });
      }
    } catch (error) {
      console.error("Fehler beim Laden des Editor-States:", error);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;

    const dataToPersist: PersistedEditorState = {
      selectedMap,
      generatorSettings,
      mapData,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToPersist));
  }, [selectedMap, generatorSettings, mapData, hasLoaded]);

  const updateCurrentMapData = (updater: (prev: MapData) => MapData) => {
    setMapData((prev) => ({
      ...prev,
      [selectedMap]: updater(prev[selectedMap]),
    }));
  };

  const handleUpdateSelectedSpawnpoint = (patch: Partial<Spawnpoint>) => {
    if (!selectedSpawnpointId) return;

    updateCurrentMapData((prev) => ({
      ...prev,
      spawnpoints: prev.spawnpoints.map((sp) =>
        sp.id === selectedSpawnpointId ? { ...sp, ...patch } : sp
      ),
    }));
  };

  const handleDeleteSelectedSpawnpoint = () => {
    if (!selectedSpawnpointId) return;

    updateCurrentMapData((prev) => ({
      ...prev,
      spawnpoints: prev.spawnpoints.filter((sp) => sp.id !== selectedSpawnpointId),
    }));

    setSelectedSpawnpointId(null);
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (activeTool === "generate") {
      updateCurrentMapData((prev) => ({
        ...prev,
        generatorCenter: { lat, lng },
      }));
      return;
    }

    const newSpawnpoint: Spawnpoint = {
      id: crypto.randomUUID(),
      lat,
      lng,
      type: "default",
    };

    updateCurrentMapData((prev) => ({
      ...prev,
      spawnpoints: [...prev.spawnpoints, newSpawnpoint],
    }));

    setSelectedSpawnpointId(newSpawnpoint.id);
  };

  const handleGenerateSpawnpoints = () => {
    if (!generatorCenter) {
      alert("Bitte zuerst 'Generate' wählen und auf die Karte klicken.");
      return;
    }

    const generated = generateSpawnpoints(
      generatorCenter.lat,
      generatorCenter.lng,
      generatorSettings
    );

    updateCurrentMapData((prev) => ({
      ...prev,
      spawnpoints: [...prev.spawnpoints, ...generated],
    }));

    setActiveTool("place");
  };

  const handleMapChange = (map: DayzMapKey) => {
    setSelectedMap(map);
    setSelectedSpawnpointId(null);
  };

  const handleResetCurrentMap = () => {
    setMapData((prev) => ({
      ...prev,
      [selectedMap]: {
        spawnpoints: [],
        generatorCenter: null,
      },
    }));
    setSelectedSpawnpointId(null);
  };

  const handleSave = () => {
    const dataToPersist: PersistedEditorState = {
      selectedMap,
      generatorSettings,
      mapData,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToPersist));
    alert(`${currentMap.label} gespeichert.`);
  };

  const handleExport = () => {
    const exportData = {
      map: selectedMap,
      label: currentMap.label,
      exportedAt: new Date().toISOString(),
      generatorSettings,
      generatorCenter,
      spawnpointCount: spawnpoints.length,
      spawnpoints,
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedMap}-spawnpoints.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  const exportData = {
    map: selectedMap,
    label: currentMap.label,
    generatorCenter,
    generatorSettings,
    spawnpointCount: spawnpoints.length,
    spawnpoints,
  };

  return (
    <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100">
      <ToolSidebar activeTool={activeTool} onToolChange={setActiveTool} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          projectName="Step ModZ Editor"
          fileName={`${currentMap.label.toLowerCase()}.map`}
          selectedMap={selectedMap}
          onMapChange={handleMapChange}
          onSave={handleSave}
          onExport={handleExport}
          onReset={handleResetCurrentMap}
        />

        <div className="grid min-h-0 flex-1 grid-rows-[140px_minmax(0,1fr)_260px] gap-3 p-3">
          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <MapSelectorCards
              selectedMap={selectedMap}
              onMapChange={handleMapChange}
            />
          </div>

          <div className="min-h-0 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <MapPanel
              activeTool={activeTool}
              spawnpoints={spawnpoints}
              selectedSpawnpointId={selectedSpawnpointId}
              generatorCenter={generatorCenter}
              mapCenter={currentMap.center}
              mapZoom={currentMap.zoom}
              mapImageUrl={currentMap.imageUrl}
              mapBounds={currentMap.bounds}
              minZoom={currentMap.minZoom}
              maxZoom={currentMap.maxZoom}
              onSelectSpawnpoint={setSelectedSpawnpointId}
              onMapClick={handleMapClick}
            />
          </div>

          <div className="grid min-h-0 grid-cols-12 gap-3">
            <div className="col-span-4 min-h-0 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <GeneratorPanel
                generatorSettings={generatorSettings}
                onGeneratorSettingsChange={setGeneratorSettings}
                onGenerate={handleGenerateSpawnpoints}
                hasGeneratorCenter={!!generatorCenter}
                selectedSpawnpoint={selectedSpawnpoint}
                onUpdateSelectedSpawnpoint={handleUpdateSelectedSpawnpoint}
                onDeleteSelectedSpawnpoint={handleDeleteSelectedSpawnpoint}
              />
            </div>

            <div className="col-span-4 min-h-0 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <SpawnpointList
                spawnpoints={spawnpoints}
                selectedSpawnpointId={selectedSpawnpointId}
                onSelectSpawnpoint={setSelectedSpawnpointId}
              />
            </div>

            <div className="col-span-4 min-h-0 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <ExportPreview
                data={exportData}
                onExport={handleExport}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}