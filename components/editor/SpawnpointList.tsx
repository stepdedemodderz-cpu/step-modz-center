import type { Spawnpoint } from "@/lib/spawnpoints";

type SpawnpointListProps = {
  spawnpoints: Spawnpoint[];
  selectedSpawnpointId: string | null;
  onSelectSpawnpoint: (id: string) => void;
};

export default function SpawnpointList({
  spawnpoints,
  selectedSpawnpointId,
  onSelectSpawnpoint,
}: SpawnpointListProps) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Spawnpoints</h2>
        <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
          {spawnpoints.length}
        </span>
      </div>

      <p className="mt-1 text-xs text-zinc-400">
        Alle Punkte der aktuell aktiven Map.
      </p>

      <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
        {spawnpoints.length === 0 ? (
          <div className="rounded-xl bg-zinc-800 p-3 text-sm text-zinc-400">
            Noch keine Spawnpoints vorhanden
          </div>
        ) : (
          spawnpoints.map((sp, index) => {
            const isSelected = selectedSpawnpointId === sp.id;

            return (
              <button
                key={sp.id}
                onClick={() => onSelectSpawnpoint(sp.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? "border-blue-500 bg-blue-600/10"
                    : "border-zinc-800 bg-zinc-950 hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    Spawn {index + 1}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-zinc-500">
                    {sp.type ?? "default"}
                  </span>
                </div>

                <div className="mt-2 text-xs text-zinc-400">
                  Y: {sp.lat.toFixed(2)} · X: {sp.lng.toFixed(2)}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}