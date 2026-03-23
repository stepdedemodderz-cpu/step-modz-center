import type { GeneratorSettings, Spawnpoint } from "@/lib/spawnpoints";

type GeneratorPanelProps = {
  generatorSettings: GeneratorSettings;
  onGeneratorSettingsChange: (settings: GeneratorSettings) => void;
  onGenerate: () => void;
  hasGeneratorCenter: boolean;
  selectedSpawnpoint: Spawnpoint | null;
  onUpdateSelectedSpawnpoint: (patch: Partial<Spawnpoint>) => void;
  onDeleteSelectedSpawnpoint: () => void;
};

export default function GeneratorPanel({
  generatorSettings,
  onGeneratorSettingsChange,
  onGenerate,
  hasGeneratorCenter,
  selectedSpawnpoint,
  onUpdateSelectedSpawnpoint,
  onDeleteSelectedSpawnpoint,
}: GeneratorPanelProps) {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Generator</h2>
        <p className="mt-1 text-xs text-zinc-400">
          Setze erst das Generator-Zentrum auf der Karte und erzeuge dann Punkte.
        </p>
      </div>

      <div className="mb-4 rounded-xl bg-zinc-800 p-3 text-xs text-zinc-300">
        {hasGeneratorCenter
          ? "Generator-Zentrum gesetzt."
          : "Tool 'Generate' wählen und auf die Karte klicken."}
      </div>

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
            className="w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm outline-none"
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
            className="w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm outline-none"
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
            className="w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm outline-none"
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
            className="w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm outline-none"
          />
        </Field>

        <button
          onClick={onGenerate}
          className="w-full rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-500"
        >
          Spawnpoints erzeugen
        </button>
      </div>

      <div className="mt-5 border-t border-zinc-800 pt-4">
        <h3 className="text-sm font-semibold text-white">Auswahl</h3>

        {!selectedSpawnpoint ? (
          <div className="mt-3 rounded-xl bg-zinc-800 p-3 text-sm text-zinc-400">
            Kein Spawnpoint ausgewählt
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <Field label="Typ">
              <input
                type="text"
                value={selectedSpawnpoint.type ?? ""}
                onChange={(e) =>
                  onUpdateSelectedSpawnpoint({ type: e.target.value })
                }
                className="w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm outline-none"
              />
            </Field>

            <Field label="Y">
              <input
                type="number"
                value={selectedSpawnpoint.lat}
                onChange={(e) =>
                  onUpdateSelectedSpawnpoint({ lat: Number(e.target.value) })
                }
                className="w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm outline-none"
              />
            </Field>

            <Field label="X">
              <input
                type="number"
                value={selectedSpawnpoint.lng}
                onChange={(e) =>
                  onUpdateSelectedSpawnpoint({ lng: Number(e.target.value) })
                }
                className="w-full rounded-xl bg-zinc-800 px-3 py-2 text-sm outline-none"
              />
            </Field>

            <button
              onClick={onDeleteSelectedSpawnpoint}
              className="w-full rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Spawnpoint löschen
            </button>
          </div>
        )}
      </div>
    </div>
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