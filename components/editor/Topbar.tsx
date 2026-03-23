import type { DayzMapKey } from "@/lib/maps";

type TopbarProps = {
  projectName: string;
  fileName: string;
  selectedMap: DayzMapKey;
  onMapChange: (map: DayzMapKey) => void;
  onSave: () => void;
  onExport: () => void;
  onReset: () => void;
};

export default function Topbar({
  projectName,
  fileName,
  selectedMap,
  onMapChange,
  onSave,
  onExport,
  onReset,
}: TopbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">
      <div className="flex items-center gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white">{projectName}</div>
          <div className="text-[11px] text-zinc-500">{fileName}</div>
        </div>

        <div className="hidden h-6 w-px bg-zinc-800 md:block" />

        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            Map
          </span>
          <select
            value={selectedMap}
            onChange={(e) => onMapChange(e.target.value as DayzMapKey)}
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-white outline-none"
          >
            <option value="chernarus">Chernarus</option>
            <option value="livonia">Livonia</option>
            <option value="sakhal">Sakhal</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-800"
        >
          Speichern
        </button>
        <button
          onClick={onExport}
          className="rounded-xl bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-500"
        >
          Export
        </button>
        <button
          onClick={onReset}
          className="rounded-xl bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
        >
          Reset
        </button>
      </div>
    </header>
  );
}