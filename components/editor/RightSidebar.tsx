import type { Spawnpoint } from "./EditorLayout";

type RightSidebarProps = {
  selectedSpawnpoint: Spawnpoint | null;
  onUpdateSelectedSpawnpoint: (patch: Partial<Spawnpoint>) => void;
  onDeleteSelectedSpawnpoint: () => void;
};

export default function RightSidebar({
  selectedSpawnpoint,
  onUpdateSelectedSpawnpoint,
  onDeleteSelectedSpawnpoint,
}: RightSidebarProps) {
  return (
    <aside className="w-80 shrink-0 overflow-y-auto border-l border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-3 text-sm font-semibold text-white">Eigenschaften</h2>

      {!selectedSpawnpoint ? (
        <div className="rounded-md bg-zinc-800 p-3 text-sm text-zinc-400">
          Kein Objekt ausgewählt
        </div>
      ) : (
        <div className="space-y-3">
          <Field label="ID">
            <div className="rounded-md bg-zinc-800 px-3 py-2 text-sm text-zinc-300">
              {selectedSpawnpoint.id}
            </div>
          </Field>

          <Field label="Latitude">
            <input
              type="number"
              value={selectedSpawnpoint.lat}
              onChange={(e) =>
                onUpdateSelectedSpawnpoint({ lat: Number(e.target.value) })
              }
              className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Longitude">
            <input
              type="number"
              value={selectedSpawnpoint.lng}
              onChange={(e) =>
                onUpdateSelectedSpawnpoint({ lng: Number(e.target.value) })
              }
              className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Typ">
            <input
              type="text"
              value={selectedSpawnpoint.type ?? ""}
              onChange={(e) =>
                onUpdateSelectedSpawnpoint({ type: e.target.value })
              }
              className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm"
            />
          </Field>

          <button
            onClick={onDeleteSelectedSpawnpoint}
            className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
          >
            Spawnpoint löschen
          </button>
        </div>
      )}
    </aside>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-400">{label}</label>
      {children}
    </div>
  );
}