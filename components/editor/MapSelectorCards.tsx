import { DAYZ_MAPS, type DayzMapKey } from "@/lib/maps";

type MapSelectorCardsProps = {
  selectedMap: DayzMapKey;
  onMapChange: (map: DayzMapKey) => void;
};

const descriptions: Record<DayzMapKey, string> = {
  chernarus: "Klassische DayZ-Map für große Spawnpoint-Netze.",
  livonia: "Kompaktere Wald- und Militärstruktur.",
  sakhal: "Schnee-Setting mit eigener Punktverteilung.",
};

export default function MapSelectorCards({
  selectedMap,
  onMapChange,
}: MapSelectorCardsProps) {
  return (
    <div className="flex h-full flex-col p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Map-Auswahl</h2>
        <p className="mt-1 text-xs text-zinc-400">
          Jede Map besitzt eigene Spawnpoints, eigenes Generator-Zentrum und eigenen Export.
        </p>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-4">
        {(Object.keys(DAYZ_MAPS) as DayzMapKey[]).map((key) => {
          const map = DAYZ_MAPS[key];
          const isActive = selectedMap === key;

          return (
            <button
              key={key}
              onClick={() => onMapChange(key)}
              className={`group rounded-3xl border p-5 text-left transition ${
                isActive
                  ? "border-blue-500 bg-blue-600/10"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-white">{map.label}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                    DayZ Map
                  </div>
                </div>

                {isActive && (
                  <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                    Aktiv
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                {descriptions[key]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}