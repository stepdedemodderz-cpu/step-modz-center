import type { GeneratorSettings, Tool } from "./EditorLayout";

type LeftSidebarProps = {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  generatorSettings: GeneratorSettings;
  onGeneratorSettingsChange: (settings: GeneratorSettings) => void;
  onGenerate: () => void;
  spawnpointCount: number;
};

const tools: { key: Tool; label: string }[] = [
  { key: "select", label: "Auswählen" },
  { key: "place-spawn", label: "Spawn setzen" },
  { key: "generate", label: "Generieren" },
  { key: "draw-area", label: "Bereich" },
];

export default function LeftSidebar({
  activeTool,
  onToolChange,
  generatorSettings,
  onGeneratorSettingsChange,
  onGenerate,
  spawnpointCount,
}: LeftSidebarProps) {
  return (
    <aside className="w-80 shrink-0 overflow-y-auto border-r border-zinc-800 bg-zinc-900 p-4">
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-white">Werkzeuge</h2>

        <div className="grid grid-cols-2 gap-2">
          {tools.map((tool) => {
            const isActive = activeTool === tool.key;

            return (
              <button
                key={tool.key}
                onClick={() => onToolChange(tool.key)}
                className={`rounded-md px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                }`}
              >
                {tool.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-white">Generator</h2>

        <div className="space-y-3">
          <Field label="Anzahl">
            <input
              type="number"
              value={generatorSettings.count}
              onChange={(e) =>
                onGeneratorSettingsChange({
                  ...generatorSettings,
                  count: Number(e.target.value),
                })
              }
              className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm outline-none ring-0"
            />
          </Field>

          <Field label="Radius">
            <input
              type="number"
              value={generatorSettings.radius}
              onChange={(e) =>
                onGeneratorSettingsChange({
                  ...generatorSettings,
                  radius: Number(e.target.value),
                })
              }
              className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm outline-none ring-0"
            />
          </Field>

          <Field label="Min. Abstand">
            <input
              type="number"
              value={generatorSettings.minDistance}
              onChange={(e) =>
                onGeneratorSettingsChange({
                  ...generatorSettings,
                  minDistance: Number(e.target.value),
                })
              }
              className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm outline-none ring-0"
            />
          </Field>

          <Field label="Seed">
            <input
              type="text"
              value={generatorSettings.seed}
              onChange={(e) =>
                onGeneratorSettingsChange({
                  ...generatorSettings,
                  seed: e.target.value,
                })
              }
              className="w-full rounded-md bg-zinc-800 px-3 py-2 text-sm outline-none ring-0"
            />
          </Field>

          <button
            onClick={onGenerate}
            className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-500"
          >
            Spawnpoints erzeugen
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-white">Übersicht</h2>
        <div className="rounded-md bg-zinc-800 p-3 text-sm text-zinc-300">
          <div className="flex justify-between">
            <span>Spawnpoints</span>
            <span className="font-medium text-white">{spawnpointCount}</span>
          </div>
        </div>
      </section>
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